import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";

export const EntrypointFormatter = iso(`
  field Query.EntrypointFormatter {
    Formatter
  }
`)(function EntrypointFormatter({ data }) {
  const Body = data.Formatter;
  const title = "Bolt Foundry Formatter";
  return { Body, title };
});
