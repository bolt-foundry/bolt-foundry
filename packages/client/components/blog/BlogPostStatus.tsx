import { PostStatus } from "packages/__generated__/BlogPageContentFragment.graphql.ts";
import { Maybe } from "deps.ts";

export function BlogPostStatus({ status }: { status: Maybe<PostStatus> }) {
  if (status !== "READY_FOR_PUBLISH") {
    return <span className="blog_status_tag">{status}</span>;
  }
  return null;
}
