import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const EntrypointBlogPost = iso(`
  field Query.EntrypointBlogPost {
    __typename
  }
`)(function EntrypointBlogPost({ data }) {
  const Body = () => "nope";
  logger.debug("data", data);
  const title = "Blog Post";
  return { Body, title };
});
