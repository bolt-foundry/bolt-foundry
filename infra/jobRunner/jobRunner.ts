const WORKER_CONCURRENCY = parseInt(Deno.env.get("WORKER_CONCURRENCY") ?? "4");
import { createWorker } from "packages/packages.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

const workers = [];

for (let i = 0; i < WORKER_CONCURRENCY; i++) {
  const worker = createWorker(
    import.meta.resolve(`./worker.ts`),
  );
  workers.push(worker);
}
logger.info(`Created ${workers.length} job runners`);
