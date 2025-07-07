import { join } from "@std/path";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface VideoConversionOptions {
  outputFormat?: "mp4" | "webm" | "gif";
  framerate?: number;
  quality?: "low" | "medium" | "high";
  deleteFrames?: boolean;
}

export interface VideoConversionResult {
  videoPath: string;
  duration: number;
  frameCount: number;
  fileSize: number;
}

export async function convertFramesToVideo(
  frameDirectory: string,
  options: VideoConversionOptions = {},
): Promise<VideoConversionResult> {
  const {
    outputFormat = "mp4",
    framerate = 12, // Increased from 10 to 12 as base framerate
    quality = "medium",
    deleteFrames = true,
  } = options;

  // Generate output filename
  const outputPath = join(
    frameDirectory,
    `../${getDirectoryName(frameDirectory)}.${outputFormat}`,
  );

  // Build ffmpeg command based on format and quality
  const ffmpegArgs = buildFFmpegArgs({
    frameDirectory,
    outputPath,
    outputFormat,
    framerate,
    quality,
  });

  logger.info(`Converting frames to video: ${outputPath}`);
  logger.debug(`ffmpeg command: ffmpeg ${ffmpegArgs.join(" ")}`);

  try {
    // Run ffmpeg conversion
    const { success } = await new Deno.Command("ffmpeg", {
      args: ffmpegArgs,
    }).output();

    if (!success) {
      logger.error(`ffmpeg conversion failed`);
      throw new Error(`Video conversion failed`);
    }

    // Get video information
    const result = await getVideoInfo(outputPath, frameDirectory);

    // Clean up frame files if requested
    if (deleteFrames) {
      await cleanupFrames(frameDirectory);
    }

    logger.info(
      `Video conversion completed: ${result.videoPath} (${result.fileSize} bytes, ${result.duration}s)`,
    );

    return result;
  } catch (error) {
    logger.error(`Video conversion error: ${(error as Error).message}`);
    throw error;
  }
}

function buildFFmpegArgs({
  frameDirectory,
  outputPath,
  outputFormat,
  framerate,
  quality,
}: {
  frameDirectory: string;
  outputPath: string;
  outputFormat: string;
  framerate: number;
  quality: string;
}): Array<string> {
  const framePattern = join(frameDirectory, "frame_%06d.png");

  const baseArgs = [
    "-y", // Overwrite output file
    "-framerate",
    framerate.toString(),
    "-i",
    framePattern,
  ];

  // Quality settings based on format
  const qualityArgs = getQualityArgs(outputFormat, quality);

  // Format-specific settings
  const formatArgs = getFormatArgs(outputFormat);

  return [
    ...baseArgs,
    ...qualityArgs,
    ...formatArgs,
    outputPath,
  ];
}

function getQualityArgs(format: string, quality: string): Array<string> {
  if (format === "mp4") {
    switch (quality) {
      case "low":
        return ["-crf", "28", "-preset", "fast"];
      case "medium":
        return ["-crf", "23", "-preset", "medium"];
      case "high":
        return ["-crf", "18", "-preset", "slow"];
      default:
        return ["-crf", "23", "-preset", "medium"];
    }
  } else if (format === "webm") {
    switch (quality) {
      case "low":
        return ["-b:v", "500k"];
      case "medium":
        return ["-b:v", "1M"];
      case "high":
        return ["-b:v", "2M"];
      default:
        return ["-b:v", "1M"];
    }
  } else if (format === "gif") {
    // GIF optimization
    return ["-vf", "palettegen=reserve_transparent=0"];
  }

  return [];
}

function getFormatArgs(format: string): Array<string> {
  switch (format) {
    case "mp4":
      return ["-c:v", "libx264", "-pix_fmt", "yuv420p"];
    case "webm":
      return ["-c:v", "libvpx-vp9"];
    case "gif":
      return ["-vf", "fps=10,scale=640:-1:flags=lanczos,palettegen"];
    default:
      return [];
  }
}

async function getVideoInfo(
  videoPath: string,
  frameDirectory: string,
): Promise<VideoConversionResult> {
  try {
    // Get file size
    const fileInfo = await Deno.stat(videoPath);
    const fileSize = fileInfo.size;

    // Count frames
    const frameCount = await countFrames(frameDirectory);

    // Get duration using ffprobe if available, otherwise estimate
    let duration = 0;
    try {
      const { success, stdout } = await new Deno.Command("ffprobe", {
        args: [
          "-v",
          "quiet",
          "-show_entries",
          "format=duration",
          "-of",
          "csv=p=0",
          videoPath,
        ],
        stdout: "piped", // We need stdout for ffprobe to get the duration
      }).output();

      if (success) {
        const output = new TextDecoder().decode(stdout).trim();
        duration = parseFloat(output) || 0;
      }
    } catch {
      // Fallback: estimate duration based on frame count and framerate
      duration = frameCount / 10; // Assuming 10fps default
    }

    return {
      videoPath,
      duration,
      frameCount,
      fileSize,
    };
  } catch (error) {
    logger.warn(
      `Could not get complete video info: ${(error as Error).message}`,
    );
    return {
      videoPath,
      duration: 0,
      frameCount: 0,
      fileSize: 0,
    };
  }
}

async function countFrames(frameDirectory: string): Promise<number> {
  try {
    let count = 0;
    for await (const entry of Deno.readDir(frameDirectory)) {
      if (entry.name.startsWith("frame_") && entry.name.endsWith(".png")) {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

async function cleanupFrames(frameDirectory: string): Promise<void> {
  try {
    logger.debug(`Cleaning up frame files in ${frameDirectory}`);
    for await (const entry of Deno.readDir(frameDirectory)) {
      if (entry.name.startsWith("frame_") && entry.name.endsWith(".png")) {
        await Deno.remove(join(frameDirectory, entry.name));
      }
    }
    // Remove the directory if it's empty
    try {
      await Deno.remove(frameDirectory);
    } catch {
      // Directory might not be empty or might not exist
    }
  } catch (error) {
    logger.warn(`Could not clean up frames: ${(error as Error).message}`);
  }
}

function getDirectoryName(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || "video";
}
