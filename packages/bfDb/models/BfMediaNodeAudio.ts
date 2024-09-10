import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import type { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { getLogger } from "deps.ts";

const BF_MEDIA_AUDIO_CACHE_LOCATION = "/tmp/bfMediaAudioCache";

const logger = getLogger(import.meta);
export class BfMediaNodeAudio extends BfNode {
  static async createFromGoogleDriveResource(
    googleDriveResource: BfGoogleDriveResource,
  ) {
    await Deno.mkdir(BF_MEDIA_AUDIO_CACHE_LOCATION, { recursive: true });
    logger.setLevel(logger.levels.DEBUG);
    const fileHandlePromise = googleDriveResource.getFileHandle();
    const bfMediaAudio = await this.create(
      googleDriveResource.currentViewer,
      {},
    );
    const outputPath = bfMediaAudio.getFilePath();
    logger.info(`Writing to ${outputPath}`);

    const args = [
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
      outputPath,
    ];

    const ffmpegProcess = new Deno.Command("ffmpeg", {
      args,
      stdin: "piped",
      stderr: "piped",
    });

    const { stdin, stderr } = ffmpegProcess.spawn();
    using fileHandle = await fileHandlePromise;
    const fileLoadingPromise = fileHandle.readable.pipeTo(stdin);

    const stderrReader = stderr.pipeThrough(new TextDecoderStream())
      .getReader();

    while (true) {
      const { done, value } = await stderrReader.read();

      if (done) break;

      const _stats = value.split("\n").reduce((acc, line) => {
        const [key, value] = line.split("=");
        if (key) {
          acc[key] = value?.trim();
        }
        return acc;
      }, {} as Record<string, string>);
    }
    await fileLoadingPromise;
    return bfMediaAudio;
  }

  getFilePath() {
    return `${BF_MEDIA_AUDIO_CACHE_LOCATION}/${this.metadata.bfGid}.aac`;
  }
}
