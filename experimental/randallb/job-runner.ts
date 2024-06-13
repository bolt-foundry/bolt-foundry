import { getLogger } from "deps.ts";
import { BfNodeGoogleDriveFile } from "packages/bfDb/models/BfNodeGoogleDriveFile.ts";
import { BfNodeJob } from "packages/bfDb/models/BfNodeJob.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";

const logger = getLogger(import.meta);
const keepaliveLogger = getLogger("workerKeepalive");

// keep workers checking for work no longer than 60 seconds.
const WORKER_TIMEOUT: number =
  parseInt(Deno.env.get("WORKER_TIMEOUT") ?? "60") * 1000;
const WORKER_INTERVAL: number =
  parseInt(Deno.env.get("WORKER_INTERVAL") ?? "1") * 1000;

let shouldCheckForWork = true;

const job = await BfNodeJob.createJobForNode(
  currentViewer,
  bfNodeGoogleDriveFile,
  "ingest",
  [],
);
