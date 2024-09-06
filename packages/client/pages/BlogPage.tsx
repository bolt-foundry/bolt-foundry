import type * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";

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

type Props = {
  cover?: string;
};

function ContentFrame({ children, cover }: React.PropsWithChildren<Props>) {
  return (
    <div className="blog_page">
      {cover && (
        <div
          className="blog_post_cover_bg"
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div className="blog_page_header">
        <div className="blog_page_header_inner">
          <div className="logo">
            <BfLogo
              boltColor="var(--text)"
              foundryColor="var(--textSecondary)"
            />
          </div>
          <div className="logo_text">Open mic</div>
        </div>
      </div>
      {cover && (
        <div
          className="blog_post_cover"
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      {children}
    </div>
  );
}

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
      <div className="blog_list">
        {posts.map((post) => (
          <h1
            key={post.title}
            onClick={() => window.location.href = `/blog/${post.slug}`}
          >
            {post.title}
          </h1>
        ))}
      </div>
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
            ... on CalloutBlock {
              id
              type
              color
              icon
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
            ... on CodeBlock {
              id
              type
              language
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
  console.log("POSTS", posts);
  return (
    <ContentFrame>
      <div className="blog_post">
        <h1>{posts[0]?.title}</h1>
        {posts[0]?.content.map((content) => {
          if (!content) return;
          if (content.type === "paragraph") {
            return (
              <p key={content.id}>
                {content.RichText.map((richText) => {
                  return (
                    <span key={richText.text.content}>
                      {richText.text.content}
                    </span>
                  );
                })}
              </p>
            );
          }
          if (content.type === "image") {
            return (
              <img
                key={content.id}
                className="blog_post_image"
                src={content.imgUrl}
                alt={content.caption[0].text.content}
              />
            );
          }
          if (content.type === "callout") {
            return (
              <div
                key={content.id}
                className={`blog_callout ${content.color}`}
              >
                {content.RichText.map((richText) => {
                  return (
                    <div
                      className="blog_callout_inner"
                      style={{ backgroundColor: content.color }}
                    >
                      <div>{content.icon}</div>
                      <div key={richText.text.content} style={{ flex: 1 }}>
                        {richText.text.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
          if (content.type === "code") {
            return (
              <div
                key={content.id}
                className="blog_code"
              >
                {content.RichText.map((richText) => {
                  return (
                    <div
                      className="blog_callout_inner"
                      style={{ backgroundColor: content.color }}
                    >
                      <div key={richText.text.content} style={{ flex: 1 }}>
                        {richText.text.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
        })}
      </div>
    </ContentFrame>
  );
}
