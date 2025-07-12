import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";

export const EntrypointDocs = iso(`
  field Query.EntrypointDocs($slug: String) {
    Docs(slug: $slug)
  }
`)(function EntrypointDocs({ data }) {
  const Body = data.Docs;
  const title = "Documentation";
  return { Body, title };
});
