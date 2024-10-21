import type { PostStatus } from "packages/__generated__/BlogPageContentFragment.graphql.ts";
import type { Maybe } from "packages/maybe.ts";

export function BlogPostStatus({ status }: { status: Maybe<PostStatus> }) {
  if (status !== "READY_FOR_PUBLISH") {
    return <span className="blog_status_tag">{status}</span>;
  }
  return null;
}
