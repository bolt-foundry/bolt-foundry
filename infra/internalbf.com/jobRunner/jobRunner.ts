import { BfCurrentViewerJobRunner, BfCurrentViewerOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfNodeJob } from "packages/bfDb/models/BfNodeJob.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

// keep workers checking for work no longer than 60 seconds.
const WORKER_TIMEOUT: number =
  parseInt(Deno.env.get("JOB_RUNNER_TIMEOUT") ?? "60") * 1000;
const WORKER_INTERVAL: number =
  parseInt(Deno.env.get("JOB_RUNNER_INTERVAL") ?? "1") * 1000;

let shouldCheckForWork = true;
const currentViewer = BfCurrentViewerOmni.__DANGEROUS__create(import.meta);
export async function checkForWork() {
  logger.debug("Checking for work");
  const jobs = await BfNodeJob.findAvailableJobs(currentViewer);
    logger.debug(`Found ${jobs.length} jobs`);
  if (jobs.length > 0) {
    const job = jobs[0];
    logger.debug(`Peeling off ${job?.metadata.bfGid}`)
    await job.executeJob();
  } 
  
  if (shouldCheckForWork) {
    logger.debug(`Setting up next work check in ${WORKER_INTERVAL}ms`);
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
