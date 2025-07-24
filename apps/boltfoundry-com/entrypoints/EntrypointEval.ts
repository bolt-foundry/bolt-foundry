import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const EntrypointEval = iso(`
  field Query.EntrypointEval {
    Eval
  }
`)(function EntrypointEval({ data }) {
  const Body = data.Eval;
  logger.debug("dataer", data);
  const title = "Eval - Bolt Foundry";
  return { Body, title };
});
