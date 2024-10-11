import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";

const logger = getLogger(import.meta);

function getMediaCacheDirectory(dirName: string): string {
  return Deno.env.get("BF_MEDIA_VIDEO_CACHE_DIRECTORY") ??
    (Deno.env.get("REPL_HOME")
      ? `${Deno.env.get("REPL_HOME")}/tmp/${dirName}`
      : `/tmp/${dirName}`);
}

export enum BfMediaNodeVideoStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum BfMediaNodeVideoRole {
  PREVIEW = "PREVIEW",
  BEST = "BEST",
}

export type BfMediaNodeVideoProps = {
  status: BfMediaNodeVideoStatus;
  processingPct: number;
  role: BfMediaNodeVideoRole;
};

export class BfMediaNodeVideo extends BfNode<BfMediaNodeVideoProps> {
  private getRawFilePath(): string {
    const cacheDirectory = getMediaCacheDirectory("bf-media-video-cache");
    return `${cacheDirectory}/${this.metadata.bfGid}.mp4`;
  }

  async getFilePath(): Promise<string | null> {
    const filePath = this.getRawFilePath();
    logger.debug("getFilePath", filePath);

    return await Deno.stat(filePath).then(() => filePath).catch(() => null);
  }

  getFile(): Promise<string> {
    throw new BfError(
      `Need to implement getFile() for ${this.constructor.name}`,
    );
  }

  async createPreview(): Promise<BfMediaNodeVideo> {
    const videos = await this.queryTargetInstances(BfMediaNodeVideo, {
      role: BfMediaNodeVideoRole.PREVIEW,
      status: BfMediaNodeVideoStatus.COMPLETED,
    });
    if (videos.length > 0) {
      logger.info("Found existing video", this);
      return videos[0];
    }
    const bfmnVideo = await this.createTargetNode(BfMediaNodeVideo, {
      status: BfMediaNodeVideoStatus.NEW,
      role: BfMediaNodeVideoRole.PREVIEW,
    });
    logger.info(`Creating preview video for ${this}`);
    const filePath = await this.getFile();
    await bfmnVideo.compressVideo(filePath);
    logger.info(`Preview video created for ${this}`);
    logger.info(`Preview video: ${bfmnVideo}`);
    return bfmnVideo;
  }

  async compressVideo(filePath: string): Promise<this> {
    const fileExists = await Deno.stat(filePath).then(() => "EXISTS").catch(
      () => "DOESN'T EXIST",
    );
    logger.debug("Input file:", filePath, fileExists);
    if (
      !await Deno.stat(BF_MEDIA_VIDEO_CACHE_DIRECTORY).then(() => true).catch(
        () => false,
      )
    ) {
      logger.error(
        "Directory doesn't exist, creating",
        BF_MEDIA_VIDEO_CACHE_DIRECTORY,
      );
      await Deno.mkdir(BF_MEDIA_VIDEO_CACHE_DIRECTORY, { recursive: true });
    }
    const outputFilePath = this.getRawFilePath();

    const ffprobeArgs = [
      "-i",
      filePath,
      "-v",
      "quiet",
      "-show_format",
      "-print_format",
      "json",
    ];
    let qualitySettings = [
      "-b:v",
      "5000k", // Set video bitrate to approximately 5 mbps
      "-crf",
      "28", // lower value for higher quality and vice versa
    ];
    if (this.props.role === BfMediaNodeVideoRole.PREVIEW) {
      qualitySettings = [
        "-b:v",
        "500k", // Set video bitrate to approximately 500 kbps
        "-vf",
        "scale=-2:480", // Resize video to height 480, maintaining aspect ratio
        "-crf",
        "28", // lower value for higher quality and vice versa
        "-preset",
        "fast", // Use a faster preset for encoding
      ];
    }

    const ffmpegArgs = [
      "-y", // overwrite file if it exists
      "-i",
      filePath,
      "-vcodec",
      "libx264",
      ...qualitySettings,
      outputFilePath,
    ];

    logger.info(`Starting video compression for ${this}`);
    this.props.status = BfMediaNodeVideoStatus.PROCESSING;
    await this.save();
    const ffprobeCmd = new Deno.Command("ffprobe", {
      args: ffprobeArgs,
      stdout: "piped",
    });
    const { stdout } = await ffprobeCmd.output();
    const ffprobeOutput = JSON.parse(new TextDecoder().decode(stdout));
    logger.debug(`ffprobe stdout`, ffprobeOutput);
    const fileDuration = parseFloat(ffprobeOutput.format.duration) * 1000;
    logger.debug(`fileDuration`, fileDuration);

    const ffmpegCmd = new Deno.Command("ffmpeg", {
      args: ffmpegArgs,
      stdout: "null",
      stderr: "piped",
    });

    const { stderr } = ffmpegCmd.spawn();
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
      logger.debug("STATS", stats);
      const outTimeUs = parseInt(stats.out_time_us);
      const outTimeMs = outTimeUs / 1000;
      const pctComplete = outTimeMs / fileDuration;
      this.updateCompressingPct(pctComplete);
    }

    const outputFileExists = await Deno.stat(outputFilePath).then(() =>
      "EXISTS"
    )
      .catch(() => "DOESN'T EXIST");
    logger.debug("Output file", outputFilePath, outputFileExists);
    logger.info(`Video compression complete for ${this}`);
    this.props.status = BfMediaNodeVideoStatus.COMPLETED;
    await this.save();
    return this;
  }

  private updateCompressingPct(pct: number) {
    // this.props.processingPct = pct;
    // await this.save();
    logger.debug(
      `${this} Compressing pct updated to ${(pct * 100).toFixed(2)}%`,
    );
  }
}
