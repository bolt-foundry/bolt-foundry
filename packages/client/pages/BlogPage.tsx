import { useLazyLoadQuery } from "react-relay";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import {
  BlogPageGlimmer,
  BlogPostContentsGlimmer,
} from "packages/client/components/blog/BlogPageGlimmer.tsx";
import { BlogPageContent } from "packages/client/components/blog/BlogPageContent.tsx";
import { BlogFrame } from "packages/client/components/blog/BlogFrame.tsx";
import { graphql } from "packages/client/deps.ts";
import type { BlogPageQuery } from "packages/__generated__/BlogPageQuery.graphql.ts";
import { BlogPostContent } from "packages/client/components/blog/BlogPostContent.tsx";
import { getLogger } from "deps.ts";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";

const logger = getLogger(import.meta);

const query = await graphql`
  query BlogPageQuery($status: [PostStatus!]) {
    currentViewer {
      blog {
        ...BlogPageContentFragment @arguments(status: $status)
        posts (first: 10, status: $status) {
          edges {
            node {
              ...BlogPostContentFragment
              slug
            }
          }
        }
      }
    }
  }
`;

export function BlogPage() {
  const { routeParams } = useRouter();
  const status = ["READY_FOR_PUBLISH"];
  const data = useLazyLoadQuery<BlogPageQuery>(
    query,
    { status },
  );

  const posts = data.currentViewer?.blog?.posts?.edges;
  const blogRef = data.currentViewer?.blog;

  if (routeParams.slug) {
    if (posts) {
      const post = posts.find((edge) => edge.node?.slug === routeParams.slug)
        ?.node;
      return <BlogPostContent postRef={post} />
    } else {
      return <BlogPostContentsGlimmer />;
    }
  }

  return (
    <BlogFrame>
      <div className="blog_list">
        {blogRef ? <BlogPageContent blogRef={blogRef} /> : <BlogPageGlimmer />}
      </div>
    </BlogFrame>
  );
}
