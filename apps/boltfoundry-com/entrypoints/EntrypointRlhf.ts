import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const EntrypointRlhf = iso(`
  field Query.EntrypointRlhf {
    RlhfInterface
  }
`)(function EntrypointRlhf({ data }) {
  logger.debug("RLHF Entrypoint executing with data:", data);
  const Body = data.RlhfInterface;
  logger.debug("RLHF Entrypoint Body:", Body);
  const title = "RLHF - Bolt Foundry";
  const result = { Body, title };
  logger.debug("RLHF Entrypoint returning:", result);
  return result;
});
