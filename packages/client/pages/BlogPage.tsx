import * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import ContentFrame from "/aws/client/components/ContentFrame.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";

const logger = getLogger(import.meta);

const postsQuery = await graphql`
  query BlogPageQuery {
    currentViewer {
      blog {
        posts(first: 10, status: "Ready for publish") {
          nodes {
            id
            title
            slug
          }
        }
      }
    }
  }
`;

export function BlogPage() {
  const { currentPath, routeParams } = useRouter();
  const { currentViewer } = useLazyLoadQuery<BlogPageQuery>(postsQuery);
  const posts = currentViewer?.blog?.posts?.nodes || [];
  logger.debug("path", currentPath, routeParams);
  if (routeParams.slug) {
    return <BlogPost />;
  }

  return (
    <ContentFrame>
      {posts.map((post) => (
        <h1
          key={post.title}
          slug={post.slug}
          onClick={() => window.location.href = `/blog/${post.slug}`}
        >
          {post.title}
        </h1>
      ))}
    </ContentFrame>
  );
}

const query = await graphql`
query BlogPagePostQuery($slug: String!) {
  currentViewer {
    blog {
      posts(first: 1, slug: $slug) {
        nodes {
          title
          slug
          status
          content {
            type
            id
            ... on ImageBlock {
              id
              type
              imgUrl
              caption {
                text {
                  content
                  link
                }
                annotations {
                  bold
                  code
                  color
                  italic
                  strikethrough
                  underlined
                }
              }
            }
            ... on ParagraphBlock {
              id
              type
              color
              RichText {
                text {
                  content
                  link
                }
                annotations {
                  bold
                  code
                  color
                  italic
                  strikethrough
                  underlined
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

function BlogPost() {
  const { slug } = useRouter().routeParams;
  const { currentViewer } = useLazyLoadQuery<BlogPagePostQuery>(query, {
    slug,
  });
  const posts = currentViewer?.blog?.posts?.nodes || [];
  return (
    <ContentFrame>
      
    </ContentFrame>
  );
}
