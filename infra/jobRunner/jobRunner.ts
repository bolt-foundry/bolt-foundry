const WORKER_CONCURRENCY = parseInt(Deno.env.get("WORKER_CONCURRENCY") ?? "4");
import { createWorker } from "packages/packages.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

const workers = [];

function killWorker(worker: Worker) {
  logger.info("killing worker");
  if (workers.includes(worker)) {
    worker.terminate();
    workers.splice(workers.indexOf(worker), 1);
  }
  if (workers.length === 0) {
    logger.info("All workers have been killed");
    globalThis.close();
  }
  logger.info(`${workers.length} remaining workers`);
}

for (let i = 0; i < WORKER_CONCURRENCY; i++) {
  setTimeout(() => {
    const worker = createWorker(
      import.meta.resolve(`./worker.ts`),
    );
    workers.push(worker);
    worker.onmessage = (e) => {
      if (e.data == "close") {
        killWorker(worker);
      }
    };
    logger.info(`Created ${workers.length} job runners`);
  }, i * 250 + Math.random() * 1000);
}
