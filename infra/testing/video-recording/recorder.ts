import type { Page } from "puppeteer-core";
import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import {
  convertFramesToVideo,
  type VideoConversionOptions,
  type VideoConversionResult,
} from "./video-converter.ts";

export interface VideoRecordingSession {
  frames: Array<Uint8Array>;
  startTime: number;
  name: string;
  outputDir: string;
}

export async function startScreencastRecording(
  page: Page,
  name: string,
  outputDir = "/tmp/videos",
): Promise<VideoRecordingSession> {
  const cdpSession = await page.target().createCDPSession();

  await ensureDir(outputDir);

  const session: VideoRecordingSession = {
    frames: [],
    startTime: Date.now(),
    name,
    outputDir,
  };

  await cdpSession.send("Page.enable");
  await cdpSession.send("Page.startScreencast", {
    format: "png",
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    everyNthFrame: 1, // Capture every frame
  });

  cdpSession.on("Page.screencastFrame", (frame) => {
    const frameBuffer = new Uint8Array(
      atob(frame.data).split("").map((c) => c.charCodeAt(0)),
    );
    session.frames.push(frameBuffer);

    // Acknowledge the frame
    cdpSession.send("Page.screencastFrameAck", {
      sessionId: frame.sessionId,
    });
  });

  return session;
}

export async function stopScreencastRecording(
  page: Page,
  session: VideoRecordingSession,
): Promise<string> {
  const cdpSession = await page.target().createCDPSession();

  await cdpSession.send("Page.stopScreencast");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const frameDir = join(session.outputDir, `${timestamp}_${session.name}`);

  await ensureDir(frameDir);

  // Save all frames as PNG files
  const framePromises = session.frames.map(async (frame, index) => {
    const frameNumber = index.toString().padStart(6, "0");
    const framePath = join(frameDir, `frame_${frameNumber}.png`);
    await Deno.writeFile(framePath, frame);
  });

  await Promise.all(framePromises);

  // Saved frames to directory

  return frameDir;
}

export async function stopScreencastRecordingWithVideo(
  page: Page,
  session: VideoRecordingSession,
  videoOptions: VideoConversionOptions = {},
): Promise<VideoConversionResult> {
  // First stop recording and save frames
  const frameDir = await stopScreencastRecording(page, session);

  // Then convert frames to video
  const videoResult = await convertFramesToVideo(frameDir, videoOptions);

  return videoResult;
}
