import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointHome = iso(`
  field Query.EntrypointHome {
    me {
      Home
    }
  }
`)(function EntrypointHome({ data }) {
  const Body = data?.me?.Home;
  const title = "Bolt Foundry";
  return { Body, title };
});
