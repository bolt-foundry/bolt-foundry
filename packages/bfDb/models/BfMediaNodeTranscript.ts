import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import { AssemblyAI } from "assemblyai";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfError } from "lib/BfError.ts";
import { callAPI } from "packages/lib/langchain.ts";

const logger = getLogger(import.meta);

const BF_MEDIA_AUDIO_CACHE_DIRECTORY =
  Deno.env.get("BF_MEDIA_AUDIO_CACHE_DIRECTORY") ?? Deno.env.get("REPL_HOME")
    ? `${Deno.env.get("REPL_HOME")}/tmp/bf-media-audio-cache`
    : "/tmp/bf-media-audio-cache";

export enum BfMediaNodeTranscriptStatus {
  CREATED = "CREATED",
  EXTRACTING_AUDIO = "EXTRACTING_AUDIO",
  TRANSCRIBING = "TRANSCRIBING",
  COMPLETED = "COMPLETED",
  NEW = "NEW",
  FAILED = "FAILED",
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
  ingestionPct: number;
  transcriptionPct: number;
};

export class BfMediaNodeTranscript extends BfNode<BfMediaNodeTranscriptProps> {
  private get filePath() {
    return `${BF_MEDIA_AUDIO_CACHE_DIRECTORY}/${this.metadata.bfGid}.aac`;
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
    await Deno.mkdir(BF_MEDIA_AUDIO_CACHE_DIRECTORY, { recursive: true });
    logger.debug(`Getting file handle for ${bfGoogleDriveResource}`);
    const fileHandlePromise = bfGoogleDriveResource.getFileHandle();
    const ffprobeArgs = [
      "-i",
      "-",
      "-v",
      "quiet",
      "-show_format",
      "-print_format",
      "json",
    ];
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
      ".3", // seconds
      "-v",
      "quiet",
      this.filePath,
    ];
    const ffmpegProcess = new Deno.Command("ffmpeg", {
      args: ffmpegArgs,
      stdin: "piped",
      stderr: "piped",
    });
    logger.info(`Starting ffmpeg transcript encode for ${this}`);
    this.props.status = BfMediaNodeTranscriptStatus.EXTRACTING_AUDIO;
    this.save();
    const { stdin, stderr } = ffmpegProcess.spawn();
    const ffprobeProcess = new Deno.Command("ffprobe", {
      args: ffprobeArgs,
      stdin: "piped",
      stdout: "piped",
    });
    const { stdin: ffprobeStdin, stdout: ffprobeStdout } = ffprobeProcess
      .spawn();

    fileHandlePromise.then((fileHandle) => {
      logger.debug(`File handle ready from ${bfGoogleDriveResource}`);
      const readableStream = fileHandle.readable;
      const ffmpegPipe = readableStream.pipeTo(stdin);
      return ffmpegPipe;
    }).catch((r) => {
      logger.error(r);
    });

    bfGoogleDriveResource.getFileHandle().then((fileHandle) => {
      const readableStream = fileHandle.readable;
      const ffprobePipe = readableStream.pipeTo(ffprobeStdin);
      return ffprobePipe;
    }).catch((r) => {
      logger.warn(`ffprobe reading fails ${r}`);
    });
    const fileDuration = await (async () => {
      const ffprobeStdoutReader = ffprobeStdout.pipeThrough(
        new TextDecoderStream(),
      ).getReader();
      let outputText = "";
      while (true) {
        const { done, value } = await ffprobeStdoutReader.read();
        if (done) break;
        outputText += value;
      }

      const ffprobeStdoutJson = JSON.parse(outputText);
      logger.debug(`ffprobe output`, ffprobeStdoutJson);
      const duration = parseFloat(ffprobeStdoutJson.format.duration);
      const durationInUs = Math.floor(
        duration * 1000,
      );
      logger.debug(`durationInUs`, durationInUs);
      return durationInUs;
    })();
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
      const outTimeUs = parseInt(stats.out_time_us);
      const outTimeMs = outTimeUs / 1000;
      const pctComplete = outTimeMs / fileDuration;
      logger.debug("stats", stats);
      this.updateIngestionPct(pctComplete);
    }
    logger.info(`File encoded to ${this.filePath}`);
    const apiKey = Deno.env.get("ASSEMBLY_AI_KEY");
    if (!apiKey) throw new BfError("No assembly AI key found");
    const assemblyAIClient = new AssemblyAI({ apiKey });
    logger.info(`Starting transcription for ${this}`);
    const audioDuration = fileDuration;
    let transcriptionInProgress = true;
    const expectedTranscriptionDuration = audioDuration * 0.7;
    const intervalLength = expectedTranscriptionDuration / 100 / 100;
    let timesReported = 0;
    const interval = setInterval(async () => {
      if (transcriptionInProgress === false) {
        clearInterval(interval);
        this.updateTranscriptionPct(1);
        this.props.status = BfMediaNodeTranscriptStatus.COMPLETED;
        await this.save();
        return;
      }
      const currentCompleted = expectedTranscriptionDuration *
        (timesReported * .4);
      const currentPct = currentCompleted / expectedTranscriptionDuration /
        100;
      const cheaterCurrentPct = .90 + currentPct / 150;
      if (cheaterCurrentPct > .99) {
        this.updateTranscriptionPct(.99);
      } else if (currentPct > .90) {
        this.updateTranscriptionPct(cheaterCurrentPct);
      } else {
        this.updateTranscriptionPct(currentPct);
      }

      timesReported++;
    }, intervalLength);
    this.props.status = BfMediaNodeTranscriptStatus.TRANSCRIBING;
    this.save();
    const transcript = await assemblyAIClient.transcripts.transcribe({
      audio: this.filePath,
      speaker_labels: true,
    }, {});

    transcriptionInProgress = false;
    logger.debug(`Transcription estimated 100`);

    logger.debug("Got transcript", transcript);
    const words = transcript.words as AssemblyAIWords;
    this.props.words = words;
    await this.save();
    logger.info(`Transcription complete for ${this}`);
    await Deno.remove(this.filePath);

    return this;
  }

  get text() {
    return this.props.words.map((word) => word.text).join(" ");
  }

  getTokenSafeText(maxTokenLength = 8192) {
    const charactersPerToken = 3;
    const maxStringLength = maxTokenLength * charactersPerToken;
    const text = this.text;

    const texts = [];
    for (let i = 0; i < text.length; i += maxStringLength) {
      texts.push(text.slice(i, i + maxStringLength));
    }

    return texts;
  }

  findClips(query: string) {
    const transcripts = this.getTokenSafeText();
    const clipsPromises = transcripts.map((transcript) =>
      callAPI(query, transcript)
    ).map(async (clipsPromise) => {
      try {
        const clips = await clipsPromise;
        const excerpts = clips.excerpts.map((clip) => {
          const timecodeInfo = this.getTimecodesForText(clip.body);
          return { ...clip, ...timecodeInfo };
        });
        return excerpts;
      } catch (e) {
        logger.error(`couldn't parse transcript for ${this}`);
        logger.debug(e);
      }
    });

    return clipsPromises;
  }

  private getTimecodesForText(
    text: string,
  ):
    | { duration: number; start: number; end: number; words: AssemblyAIWord[] }
    | null {
    const words = text.toLowerCase().split(" ");
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    const originalLength = words.length;
    const MAX_ALLOWED_WORDS = 10000; // Set an appropriate limit

    if (originalLength > MAX_ALLOWED_WORDS) {
      logger.error(
        `Input text is too long (${originalLength} words). Maximum allowed is ${MAX_ALLOWED_WORDS}.`,
      );
      return null;
    }

    const candidates = [];

    for (let i = 0; i < this.props.words.length; i++) {
      if (this.props.words[i].text.toLowerCase() === firstWord) {
        const candidate = [];
        let j = i;
        while (j < this.props.words.length && candidate.length < words.length) {
          candidate.push(this.props.words[j]);
          if (this.props.words[j].text.toLowerCase() === lastWord) {
            // Calculate a score based on length difference
            const lengthDiff = Math.abs(candidate.length - originalLength);
            candidates.push({words: candidate, score: lengthDiff});
            break;
          }
          j++;
        }
      }
    }
    
    if (candidates.length === 0) {
      return null;
    }

    let bestCandidate = candidates[0];

    if (candidates.length > 1) {
      logger.debug("Candidates", candidates);
      candidates.sort((a, b) => a.score - b.score);
      bestCandidate = candidates[0];

      if (bestCandidate.score > 50) {
        logger.info(
          `${this} found ${candidates.length} potential candidates. The chosen one had a score of ${bestCandidate.score} and was ${bestCandidate.words.length} words long, the original text had ${originalLength} words`,
        );
        const chosenText = bestCandidate.words.map((w) => w.text).join(" ");
        logger.debug({ chosenText, originalText: text });
        candidates.forEach((candidate) => {
          logger.debug({
            foundText: candidate.words.map((w) => w.text).join(" "),
            originalText: text,
          });
        });
      }
    }

    const start = bestCandidate.words[0].start;
    const end = bestCandidate.words[bestCandidate.words.length - 1].end;
    const duration = end - start;
    return {
      duration,
      start,
      end,
      words: bestCandidate.words,
    };
  }

  private async updateTranscriptionPct(pct: number) {
    this.props.transcriptionPct = pct;
    await this.save();
    logger.debug(
      `${this} Transcription pct updated to ${(pct * 100).toFixed(2)}%`,
    );
  }

  private async updateIngestionPct(pct: number) {
    this.props.ingestionPct = pct;
    await this.save();
    logger.debug(`${this} Ingestion pct updated to ${(pct * 100).toFixed(2)}%`);
  }
}
