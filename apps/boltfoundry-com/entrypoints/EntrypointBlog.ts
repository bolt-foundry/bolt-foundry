import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const EntrypointBlog = iso(`
  field Query.EntrypointBlog {
    Blog
  }
`)(function EntrypointBlog({ data }) {
  const Body = data.Blog;
  const title = "Blog";
  return { Body, title };
});
