import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const EntrypointHome = iso(`
  field Query.EntrypointHome {
    Home
  }
`)(function EntrypointHome({ data }) {
  const Body = data.Home;
  logger.debug("dataer", data);
  const title = "Bolt Foundry: Unit Tests for LLMs.";
  return { Body, title };
});
