import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";

export const EntrypointBlog = iso(`
  field Query.EntrypointBlog {
    me {
      contentCollection(slug: "blog") {
        ContentCollection
      }
    }
  }
`)(function EntrypointBlog({ data }) {
  const title = "Content Foundry";
  const DefaultBody = () => "coming soon";

  return {
    Body: data?.me?.contentCollection?.ContentCollection ?? DefaultBody,
    title,
  };
});
