import { BfCurrentViewerOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfNodeJob } from "packages/bfDb/models/BfNodeJob.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

const randomSecondsSeed = Math.floor(Math.random() * 1000);

// keep workers checking for work no longer than the specified environment variable.
const WORKER_TIMEOUT: number =
  parseInt(Deno.env.get("JOB_RUNNER_TIMEOUT") ?? "55") * 1000 - randomSecondsSeed;
const WORKER_INTERVAL: number =
  parseInt(Deno.env.get("JOB_RUNNER_INTERVAL") ?? "1") * 1000 - randomSecondsSeed;
logger.info(`Worker timeout: ${WORKER_TIMEOUT}ms, interval: ${WORKER_INTERVAL}ms`)

let shouldCheckForWork = true;
const currentViewer = BfCurrentViewerOmni.__DANGEROUS__create(import.meta);
export async function checkForWork() {
  logger.info("Checking for work");
  const jobs = await BfNodeJob.findAvailableJobs(currentViewer);
    logger.info(`Found ${jobs.length} jobs`);
  if (jobs.length > 0) {
    const job = jobs[0];
    logger.info(`Peeling off ${job?.metadata.bfGid}`)
    await job.executeJob();
  } 

  if (shouldCheckForWork) {
    logger.info(`Setting up next work check in ${WORKER_INTERVAL}ms`);
    setTimeout(checkForWork, WORKER_INTERVAL);
    return;
  }
  logger.info("No work to do, timeout hit.");
  globalThis.close();
}
function disableCheckForWork() {
  shouldCheckForWork = false;
}
if (import.meta.main) {
  logger.info("Worker is main, starting to check for work");
  checkForWork();
  setTimeout(disableCheckForWork, WORKER_TIMEOUT);
}
