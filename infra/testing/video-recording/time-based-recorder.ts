import type { Page } from "puppeteer-core";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import {
  convertFramesToVideo,
  type VideoConversionOptions,
  type VideoConversionResult,
} from "./video-converter.ts";

export interface TimeBasedRecordingSession {
  frames: Array<{ data: Uint8Array; timestamp: number }>;
  intervalId: number;
  startTime: number;
  name: string;
  outputDir: string;
  targetFps: number;
}

export async function startTimeBasedRecording(
  page: Page,
  name: string,
  targetFps = 24, // 24 fps for smooth video recording
  outputDir = "/tmp/videos",
): Promise<TimeBasedRecordingSession> {
  await ensureDir(outputDir);

  const session: TimeBasedRecordingSession = {
    frames: [],
    intervalId: 0,
    startTime: Date.now(),
    name,
    outputDir,
    targetFps,
  };

  // Calculate interval for consistent frame timing
  const intervalMs = 1000 / targetFps;

  // Capture screenshots at regular intervals
  const intervalId = setInterval(async () => {
    try {
      // Check if page is still open before capturing
      if (page.isClosed()) {
        clearInterval(intervalId);
        return;
      }

      const screenshot = await page.screenshot({
        type: "png",
        fullPage: false, // Capture visible viewport only for better performance
      });

      session.frames.push({
        data: new Uint8Array(screenshot),
        timestamp: Date.now(),
      });
    } catch (error) {
      // If screenshot fails, likely page is closed, stop recording
      if (
        (error as Error).name === "TargetCloseError" ||
        (error as Error).message?.includes("Session closed")
      ) {
        clearInterval(intervalId);
        return;
      }
      // Failed to capture frame
    }
  }, intervalMs);

  session.intervalId = intervalId;

  return session;
}

export async function stopTimeBasedRecording(
  _page: Page,
  session: TimeBasedRecordingSession,
): Promise<string> {
  // Stop the interval - ensure it's cleared even if already cleared
  if (session.intervalId) {
    clearInterval(session.intervalId);
    session.intervalId = 0;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const frameDir = join(session.outputDir, `${timestamp}_${session.name}`);

  await ensureDir(frameDir);

  // Save all frames as PNG files with consistent timing
  const framePromises = session.frames.map(async (frame, index) => {
    const frameNumber = index.toString().padStart(6, "0");
    const framePath = join(frameDir, `frame_${frameNumber}.png`);
    await Deno.writeFile(framePath, frame.data);
  });

  await Promise.all(framePromises);

  // Saved frames to directory

  return frameDir;
}

export async function stopTimeBasedRecordingWithVideo(
  _page: Page,
  session: TimeBasedRecordingSession,
  videoOptions: VideoConversionOptions = {},
): Promise<VideoConversionResult> {
  // First stop recording and save frames
  const frameDir = await stopTimeBasedRecording(_page, session);

  // Use the target FPS for video conversion if not specified
  const finalVideoOptions = {
    framerate: session.targetFps,
    ...videoOptions,
  };

  // Then convert frames to video
  const videoResult = await convertFramesToVideo(frameDir, finalVideoOptions);

  return videoResult;
}
