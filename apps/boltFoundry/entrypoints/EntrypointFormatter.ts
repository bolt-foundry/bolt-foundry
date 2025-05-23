import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointFormatter = iso(`
  field Query.EntrypointFormatter {
    Formatter
  }
`)(function EntrypointFormatter({ data }) {
  const Body = data.Formatter;
  const title = "Bolt Foundry Formatter";
  return { Body, title };
});
