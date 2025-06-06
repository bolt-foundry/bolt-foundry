import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointBlog = iso(`
  field Query.EntrypointBlog($slug: String) {
    Blog(slug: $slug)
  }
`)(function EntrypointBlog({ data }) {
  const Body = data.Blog;
  const title = "Blog";
  return { Body, title };
});
