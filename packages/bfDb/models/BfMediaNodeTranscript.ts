import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import { AssemblyAI } from "assemblyai";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";

const logger = getLogger(import.meta);

const BF_MEDIA_AUDIO_CACHE_LOCATION = "/tmp/bfMediaAudioCache";

export enum BfMediaNodeTranscriptStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  NEW = "NEW",
}
type AssemblyAIWord = {
  start: number;
  end: number;
  text: string;
  confidence: number; // in 0-1
  speaker: string; // label, like "A"
};
type AssemblyAIWords = Array<AssemblyAIWord>;

export type BfMediaNodeTranscriptProps = {
  words: AssemblyAIWords;
  status: BfMediaNodeTranscriptStatus;
};

export class BfMediaNodeTranscript extends BfNode<BfMediaNodeTranscriptProps> {
  private get filePath() {
    return `${BF_MEDIA_AUDIO_CACHE_LOCATION}/${this.metadata.bfGid}.aac`;
  }

  async requestTranscriptionFromGoogleDriveResourceId(
    googleDriveResourceId: string,
  ) {
    logger.debug(
      "requestTranscriptionFromGoogleDriveResourceId",
      googleDriveResourceId,
    );
    const bfGoogleDriveResource = await BfGoogleDriveResource.findX(
      this.currentViewer,
      toBfGid(googleDriveResourceId),
    );
    await Deno.mkdir(BF_MEDIA_AUDIO_CACHE_LOCATION, { recursive: true });
    logger.debug(`Getting file handle for ${bfGoogleDriveResource}`);
    const fileHandlePromise = bfGoogleDriveResource.getFileHandle();
    const ffmpegArgs = [
      "-i",
      "-",
      "-codec:a",
      "aac",
      "-b:a",
      "256k",
      "-y",
      "-progress",
      "pipe:2",
      "-stats_period",
      "0.2", // seconds
      "-v",
      "quiet",
      this.filePath,
    ];
    const ffmpegProcess = new Deno.Command("ffmpeg", {
      args: ffmpegArgs,
      stdin: "piped",
      stderr: "piped",
    });
    logger.debug("Starting ffmpeg");
    const { stdin, stderr } = ffmpegProcess.spawn();
    const fileLoadingPromise = fileHandlePromise.then((fileHandle) => {
      logger.debug(`File handle ready from ${bfGoogleDriveResource}`);
      return fileHandle.readable.pipeTo(stdin);
    });
    const stderrReader = stderr.pipeThrough(new TextDecoderStream())
      .getReader();
    while (true) {
      const { done, value } = await stderrReader.read();
      if (done) break;
      const stats = value.split("\n").reduce((acc, line) => {
        const [key, value] = line.split("=");
        if (key) {
          acc[key] = value?.trim();
        }
        return acc;
      }, {} as Record<string, string>);
      logger.debug("ffmpeg stats", stats);
    }
    await fileLoadingPromise;
    logger.debug(`File encoded to ${this.filePath}`);
    const apiKey = Deno.env.get("ASSEMBLY_AI_KEY");
    const assemblyAIClient = new AssemblyAI({ apiKey });
    logger.debug(`Starting transcription for ${this}`);
    const transcript = await assemblyAIClient.transcripts.transcribe({
      audio: this.filePath,
      speaker_labels: true,
    }, {});
    logger.debug("Got transcript", transcript);
    const words = transcript.words as AssemblyAIWords;
    this.props.words = words;
    await this.save();
    logger.debug(`Transcription complete for ${this}`);
    return this;
  }
}