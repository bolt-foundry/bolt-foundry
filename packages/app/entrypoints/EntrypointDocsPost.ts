import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import type { RouteEntrypoint } from "packages/app/routes.ts";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

export const EntrypointDocsPost = iso(`
  field Query.EntrypointDocsPost($docsSlug: ID) {
    me {
      docs {
        post(slug: $docsSlug) {
          __typename
          DocsPostListItem
          title
        }
      }
    }
  }
`)(function EntrypointDocsPost({ data }): RouteEntrypoint {
  logger.setLevel(logger.levels.DEBUG);
  const Body = data?.me?.docs?.post?.DocsPostListItem ?? (() => "no doc");
  logger.debug("dataer", data);
  const title = "Documentation Post";
  return { Body, title };
});
