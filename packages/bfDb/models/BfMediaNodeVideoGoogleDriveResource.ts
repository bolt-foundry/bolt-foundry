import { BfMediaNodeVideo } from "packages/bfDb/models/BfMediaNodeVideo.ts";
import type { BfNodeRequiredProps } from "packages/bfDb/coreModels/BfNode.ts";
import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";

const BF_MEDIA_AUDIO_CACHE_LOCATION = "/tmp/bfMediaAudioCache";

const logger = getLogger(import.meta);

type BfMediaNodeVideoGoogleDriveResourceProps = {
  googleDriveResourceId: string;
} & BfNodeRequiredProps;

export class BfMediaNodeVideoGoogleDriveResource
  extends BfMediaNodeVideo<BfMediaNodeVideoGoogleDriveResourceProps> {
    async createTranscript() {
      const bfGoogleDriveResource = await BfGoogleDriveResource.findX(this.currentViewer, toBfGid(this.props.googleDriveResourceId));
      await Deno.mkdir(BF_MEDIA_AUDIO_CACHE_LOCATION, { recursive: true });
      const fileHandlePromise = bfGoogleDriveResource.getFileHandle();
      const filePath = `${BF_MEDIA_AUDIO_CACHE_LOCATION}/${this.metadata.bfGid}.aac`;
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
        filePath,
      ];
      const ffmpegProcess = new Deno.Command("ffmpeg", {
        args: ffmpegArgs,
        stdin: "piped",
        stderr: "piped",
      });
      const { stdin, stderr } = ffmpegProcess.spawn();
      const fileLoadingPromise = fileHandlePromise.then((fileHandle) => {
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
        logger.info(stats);
      }
      await fileLoadingPromise;
      logger.info(`Probably loaded at ${filePath}`)
      return filePath;
    }
}
