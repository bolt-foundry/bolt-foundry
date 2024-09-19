import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfJob, BfJobType } from "packages/bfDb/models/BfJob.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

const randomSecondsSeed = Math.floor(Math.random() * 1000);

// keep workers checking for work no longer than the specified environment variable.
const WORKER_TIMEOUT: number = Deno.env.get("BF_ENV") === "DEVELOPMENT"
  ? 0
  : parseInt(Deno.env.get("JOB_RUNNER_TIMEOUT") ?? "55") * 1000 -
    randomSecondsSeed;

const WORKER_INTERVAL: number =
  parseInt(Deno.env.get("JOB_RUNNER_INTERVAL") ?? "1") * 1000 -
  randomSecondsSeed;
logger.info(
  `Worker timeout: ${WORKER_TIMEOUT}ms, interval: ${WORKER_INTERVAL}ms`,
);

let shouldCheckForWork = true;
const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
  import.meta,
);
export async function checkForWork(shouldClose = true) {
  logger.debug("Checking for work");
  const jobs = await BfJob.findAvailableJobs(currentViewer);
  logger.debug(`Found ${jobs.length} jobs`);
  if (jobs.length > 0) {
    const job = jobs[0];
    logger.info(`Peeling off ${job}`);
    try {
      await job.executeJob();
    } catch (e) {
      logger.error(e)
      job.props.status = BfJobType.FAILED;
      await job.save()
    }
    
  }

  if (shouldCheckForWork) {
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
  shouldCheckForWork = false;
}
export function close() {
  disableCheckForWork();
  logger.info("Closing");
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
