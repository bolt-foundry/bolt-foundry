import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";

export const EntrypointDocsPage = iso(`
  field Query.EntrypointDocsPage {
    Docs
  }
`)(function EntrypointDocsPage({ data }) {
  const Body = data.Docs;
  const title = `Documentation`;
  return { Body, title };
});