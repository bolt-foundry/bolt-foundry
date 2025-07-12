import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";

export const EntrypointBlog = iso(`
  field Query.EntrypointBlog($slug: String) {
    Blog(slug: $slug)
  }
`)(function EntrypointBlog({ data }) {
  const Body = data.Blog;
  const title = "Blog";
  return { Body, title };
});
