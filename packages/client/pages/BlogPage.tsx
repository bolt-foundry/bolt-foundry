import * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { BlogPageQuery } from "packages/__generated__/BlogPageQuery.graphql.ts";

const logger = getLogger(import.meta);

const postsQuery = await graphql`
  query BlogPageQuery {
    currentViewer {
    blog {
      posts(first: 10) {
        nodes {
          title
          slug
        }
      }
    }
  }
  }
`;

type Props = React.PropsWithChildren;


function ContentFrame({children}: Props) {
  return children
}

export function BlogPage() {
  const { currentPath, routeParams } = useRouter();
  const { currentViewer } = useLazyLoadQuery<BlogPageQuery>(postsQuery);
  const posts = currentViewer?.blog?.posts?.nodes ?? [];
  logger.debug("path", currentPath, routeParams);
  if (routeParams.slug) {
    return <BlogPost />;
  }

  return (
      posts.map((post) => (
        <h1
          key={post.title}
          onClick={() => window.location.href = `/blog/${post.slug}`}
        >
          {post.title}
        </h1>
      ))
  );
}

const query = await graphql`
query BlogPagePostQuery($slug: String!) {
  currentViewer {
    blog {
      posts(slug: $slug, first: 10) {
        nodes {
          slug
          title
          content {
            type
            ... on ImageBlock {
              id
              imgUrl
              type
            }
            ... on ParagraphBlock {
              id
              rawText
              type
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
      {posts.map((post) => (
        <div key={post.slug}>
          <h1>{post.title}</h1>
          {post.content.map((block) => {
            if (block.type === "image") {
              return <img key={block.id} src={block.imgUrl} alt={block.type} />;
            } else if (block.type === "paragraph") {
              return <p key={block.id}>{block.rawText}</p>;
            } else {
              return null;
            }
          })}
        </div>
      ))}
    </ContentFrame>
  );
}
