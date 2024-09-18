import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { BlogPageGlimmer } from "packages/client/components/blog/BlogPageGlimmer.tsx";
import { BlogPageContent } from "packages/client/components/blog/BlogPageContent.tsx";
import { BlogFrame } from "packages/client/components/blog/BlogFrame.tsx";
import { graphql } from "packages/client/deps.ts";
import type { BlogPageQuery } from "packages/__generated__/BlogPageQuery.graphql.ts";
import { BlogPostContent } from "packages/client/components/blog/BlogPostContent.tsx";
import { BlogPostContentFragment$key } from "packages/__generated__/BlogPostContentFragment.graphql.ts";

const query = await graphql`
  query BlogPageQuery {
    currentViewer {
      blog {
        ...BlogPageContentFragment
        posts (first: 10, status: "Ready for publish") {
          nodes {
            ...BlogPostContentFragment
            slug
          }
        }
      }
    }
  }
`;

export function BlogPage() {
  const { routeParams } = useRouter();
  const data = useLazyLoadQuery<BlogPageQuery>(
    query,
    {},
  );

  const posts = data.currentViewer?.blog?.posts?.nodes ?? [];
  if (routeParams.slug) {
    const post = posts.find((post) =>
      post.slug === routeParams.slug
    ) as BlogPostContentFragment$key;
    return <BlogPostContent postRef={post} />;
  }

  return (
    <BlogFrame>
      <div className="blog_list">
        <Suspense fallback={<BlogPageGlimmer />}>
          <BlogPageContent blogRef={data.currentViewer?.blog} />
        </Suspense>
      </div>
    </BlogFrame>
  );
}
