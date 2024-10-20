#! /usr/bin/env -S deno run -A

import { dirname } from "@std/path";
import { notifyDiscord, processFile } from "infra/watcher/ingest.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const FOLDER_PATH = Deno.env.get("BFI_FOLDER_PATH");
if (!FOLDER_PATH) {
  throw new Error("BFI_FOLDER_PATH not found");
}
const PATH_FOR_INGEST = "01 New Videos";
const PATH_FOR_ARCHIVE = "Z Processed Videos";
const MAX_RETRIES = 15;
const events = Deno.watchFs(FOLDER_PATH, { recursive: true });
const TMP_DIR = Deno.env.get("BFI_TMP_DIR") || "/tmp";
logger.info(`watching ${FOLDER_PATH}`);
const seenFiles = new Set();
notifyDiscord(`BFI watcher running on ${Deno.env.get("HOSTNAME")}`);
Deno.addSignalListener("SIGTERM", async () => {
  await notifyDiscord(`BFI watcher ${Deno.env.get("HOSTNAME")} shutting down`);
});
Deno.addSignalListener("SIGINT", async () => {
  await notifyDiscord(`BFI watcher ${Deno.env.get("HOSTNAME")} shutting down`);
  Deno.exit();
});
globalThis.addEventListener("unload", async () => {
  await notifyDiscord(`BFI watcher ${Deno.env.get("HOSTNAME")} shutting down`);
});
for await (const event of events) {
  if (event.paths[0].includes(".DS_Store")) {
    continue;
  }

  if (event.kind === "modify") {
    copyAndMove(event.paths[0]);
  }
}

async function copyAndMove(path: string) {
  if (!FOLDER_PATH) {
    throw new Error("BFI_FOLDER_PATH not found");
  }

  let tmpFile;
  const fileDirectory = dirname(path);
  const filename = path.split("/").pop();
  const archiveDirectory = `${dirname(fileDirectory)}/${PATH_FOR_ARCHIVE}`;
  const archivePath = `${archiveDirectory}/${filename}`;
  const end = path.split(FOLDER_PATH)[1].split("/")[1];
  const humanReadable = `${end} - ${filename}`;
  try {
    const stat = await Deno.stat(path);

    if (stat.isFile && !seenFiles.has(path) && path.includes(PATH_FOR_INGEST)) {
      notifyDiscord(`New video detected: **${humanReadable}**`);
      seenFiles.add(path);
      tmpFile = await Deno.makeTempFile({ dir: TMP_DIR, prefix: "copy_" });
      logger.info("copying", path, tmpFile);
      const success = await copyFileWithRetry(path, tmpFile);

      if (success) {
        await Deno.rename(path, archivePath);
        logger.info("processing");

        notifyDiscord(`Starting to process **${humanReadable}**`);
        await processFile(tmpFile, humanReadable);
        logger.info("done");
      } else {
        logger.info("failed to copy file after retries", path);
      }
    }
  } catch (e) {
    // notifyDiscord(`Error processing: **${humanReadable}**
    // ${e}
    // `);
    logger.error(e);
  } finally {
    if (tmpFile) {
      await Deno.remove(tmpFile);
    }
  }
}

async function copyFileWithRetry(
  src: string,
  dest: string,
  maxRetries: number = MAX_RETRIES,
): Promise<boolean> {
  let attempt = 0;
  let delay = 1000; // initial delay in milliseconds

  while (attempt < maxRetries) {
    try {
      await Deno.copyFile(src, dest);
      return true; // success
    } catch (e) {
      if (e.name === "TimedOut") {
        logger.info(`Attempt ${attempt + 1} failed: ${e.message}`);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        logger.error(`Unexpected error encountered: ${e.message}`);
        return false;
      }
    }
  }

  return false; // failed after max retries
}
