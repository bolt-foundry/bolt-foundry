import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointDocs = iso(`
  field Query.EntrypointDocs($slug: String) {
    Docs(slug: $slug)
  }
`)(function EntrypointDocs({ data }) {
  const Body = data.Docs;
  const title = "Documentation";
  return { Body, title };
});
