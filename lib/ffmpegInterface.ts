import { getLogger } from "deps.ts";
import startSpinner from "lib/terminalSpinner.ts";

const logger = getLogger(import.meta);

const BF_PATH = Deno.env.get("BF_PATH");
const BF_TEMP_DIR = `${BF_PATH}/build/tmp`;
const BF_OUT_PATH = `${BF_TEMP_DIR}/chunks`;

export async function streamFileToFfmpegForChunking(
  fileStream: ReadableStream<Uint8Array>,
) {
  // Step 0: recursively create the temp directory
  await Promise.all([
    Deno.mkdir(BF_TEMP_DIR, { recursive: true }),
    Deno.mkdir(BF_OUT_PATH, { recursive: true }),
  ]);

  // Step 1: Create a temporary file
  const tempFilePath = await Deno.makeTempFile({
    dir: BF_TEMP_DIR,
  });
  const file = await Deno.create(tempFilePath);
  await Deno.mkdir(`/tmp/bff`, { recursive: true });

  // Step 2: Write the file stream to the temporary file
  const writer = file.writable.getWriter();
  logger.info(`writing to ${tempFilePath}`);
  let totalWritten = 0;
  const interval = setInterval(() => {
    logger.info(
      `wrote ${
        (totalWritten / 1_000_000_000).toFixed(2)
      } gb to ${tempFilePath}`,
    );
  }, 500);
  const stopSpinner = startSpinner();
  for await (const chunk of fileStream) {
    await writer.write(chunk);
    totalWritten += chunk.length;
  }
  stopSpinner();

  clearInterval(interval);
  logger.info(`wrote to ${tempFilePath}`);
  await writer.close();

  const filename = tempFilePath.split("/").pop() as string;

  // Step 3: Set up ffmpeg arguments to read from temp file
  const ffmpegArgs = [];
  ffmpegArgs.push("-i", tempFilePath);
  ffmpegArgs.push("-vf", "crop=ih*(16/9):ih,scale=1920:1080");
  ffmpegArgs.push("-c:v", "libx264");
  ffmpegArgs.push("-b:v", "7M"); // Set bitrate to 7 Megabits per second
  ffmpegArgs.push("-c:a", "aac");
  ffmpegArgs.push("-b:a", "128k");
  ffmpegArgs.push("-f", "segment");
  ffmpegArgs.push("-segment_time", "1800"); // Maximum segment length (~30 minutes)
  ffmpegArgs.push("-reset_timestamps", "1");
  ffmpegArgs.push(`${BF_OUT_PATH}/${filename}_⚡️_%03d.mp4`);

  // Step 4: Run ffmpeg
  const cmd = new Deno.Command("ffmpeg", {
    args: ffmpegArgs,
    env: Deno.env.toObject(),
  });

  const ffmpegProcess = cmd.spawn();
  const output = await ffmpegProcess.output();
  logger.info(`ffmpeg status: ${output.success} / ${output.code}`);
}
