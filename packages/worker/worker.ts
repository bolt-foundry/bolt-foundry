import { getLogger } from "deps.ts"
import { DeploymentTypes } from "packages/main.ts";
const logger = getLogger(import.meta)
const keepaliveLogger = getLogger("workerKeepalive");
const deploymentType = Deno.env.get("DEPLOYMENT_TYPE") ??
  DeploymentTypes.DEVELOPMENT;
if (deploymentType === DeploymentTypes.DEVELOPMENT) {
  keepaliveLogger.disableAll();
}
// keep workers checking for work no longer than 60 seconds.
const WORKER_TIMEOUT: number = parseInt(Deno.env.get("WORKER_TIMEOUT") ?? "60") * 1000;
const WORKER_INTERVAL: number = parseInt(Deno.env.get("WORKER_INTERVAL") ?? "1") * 1000;

let shouldCheckForWork = true;
function checkForWork() {
  keepaliveLogger.info("Checking for work");
  if (shouldCheckForWork) {
    setTimeout(checkForWork, WORKER_INTERVAL);
    return;
  }
  keepaliveLogger.info("No work to do, timeout hit.");
  globalThis.close();
  
}
function disableCheckForWork() {
  shouldCheckForWork = false;
}
if (import.meta.main) {
  logger.info("Worker is main");
  checkForWork();
  setTimeout(disableCheckForWork, WORKER_TIMEOUT)
}