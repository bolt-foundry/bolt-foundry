import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointGrader = iso(`
  field Query.EntrypointGrader {
    Grader
  }
`)(function EntrypointGrader({ data }) {
  const Body = data.Grader;
  const title = "Bolt Foundry Grader";
  return { Body, title };
});
