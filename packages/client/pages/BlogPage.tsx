import * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import ContentFrame from "/aws/client/components/ContentFrame.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";

const logger = getLogger(import.meta);
logger.setLevel(logger.levels.DEBUG);

const postsQuery = await graphql`
  query BlogPageQuery {
    currentViewer {
      blog {
        posts(first: 10) {
          count
        }
      }
    }
  }
`;

export function BlogPage() {
  const { currentPath, routeParams } = useRouter();
  logger.debug("path", currentPath, routeParams);

  if (routeParams.slug) {
    return <BlogPost />;
  }

  return (
    <ContentFrame>
      lol blog {routeParams.slug}
    </ContentFrame>
  );
}

const query = await graphql`
query BlogPagePostQuery($slug: String!) {
  currentViewer {
      blog {
        posts(slug: $slug, first: 1) {
          nodes {
          title
          content
          }
        }
      }
    }
}

`;
function BlogPost() {
  const { slug } = useRouter().routeParams;
  const { title } = useLazyLoadQuery<BlogPagePostQuery>(query, { slug });

  return (
    <ContentFrame>
      lol blog post {title}
    </ContentFrame>
  );
}
