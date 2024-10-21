import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfJob, BfJobType } from "packages/bfDb/models/BfJob.ts";
import { getLogger } from "packages/logger/logger.ts";

const randomSecondsSeed = Math.floor(Math.random() * 1000);
const logger = getLogger(`${randomSecondsSeed} worker - ${import.meta.url}`);
// keep workers checking for work no longer than the specified environment variable.
const WORKER_TIMEOUT: number = Deno.env.get("BF_ENV") === "DEVELOPMENT"
  ? 0
  : parseInt(Deno.env.get("JOB_RUNNER_TIMEOUT") ?? "55") * 1000 -
    randomSecondsSeed;

const WORKER_INTERVAL: number =
  parseInt(Deno.env.get("JOB_RUNNER_INTERVAL") ?? "4") * 1000 -
  randomSecondsSeed;
logger.info(
  `Worker timeout: ${WORKER_TIMEOUT}ms, interval: ${WORKER_INTERVAL}ms`,
);

let readyForWork = true;
const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
  import.meta,
);
export async function checkForWork(shouldClose = true) {
  logger.debug("Checking to execute");
  await BfJob.executeNextJob(currentViewer);
  logger.debug("Done with execution of work");

  if (readyForWork) {
    logger.debug(`Setting up next work check in ${WORKER_INTERVAL}ms`);
    setTimeout(checkForWork, WORKER_INTERVAL);
    return;
  }
  logger.info("No work to do, timeout hit.");
  if (shouldClose) {
    close();
  }
}
export function disableCheckForWork() {
  readyForWork = false;
}
export function close() {
  disableCheckForWork();
  logger.info("Closing");
  globalThis.postMessage("close");
  globalThis.close();
}
if (import.meta.main) {
  logger.info("Worker is main, starting to check for work");
  checkForWork();
  if (WORKER_TIMEOUT > 0) {
    logger.info(`Worker timeout set to ${WORKER_TIMEOUT}ms`);
    setTimeout(disableCheckForWork, WORKER_TIMEOUT);
  } else {
    logger.info("Worker timeout not set, no timeout");
  }
}
