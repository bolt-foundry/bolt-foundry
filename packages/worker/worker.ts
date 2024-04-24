import { getLogger } from "deps.ts"
const logger = getLogger(import.meta)

// keep workers checking for work no longer than 60 seconds.
const WORKER_TIMEOUT: number = parseInt(Deno.env.get("WORKER_TIMEOUT") ?? "60") * 1000;
const WORKER_INTERVAL: number = parseInt(Deno.env.get("WORKER_INTERVAL") ?? "1") * 1000;

let shouldCheckForWork = true;
function checkForWork() {
  logger.info("Checking for work");
  if (shouldCheckForWork) {
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
  logger.info("Worker is main");
  checkForWork();
  setTimeout(disableCheckForWork, WORKER_TIMEOUT)
}