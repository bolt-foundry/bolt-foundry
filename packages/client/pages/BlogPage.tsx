import type * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { classnames } from "lib/classnames.ts";
import { Link } from "packages/bfDs/Link.tsx";

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
            date
            author {
              name
              email
              avatarUrl
            }
            coverUrl
          }
        }
      }
    }
  }
`;

type Props = {
  cover?: string;
  post?: boolean;
};

function ContentFrame(
  { children, cover, post }: React.PropsWithChildren<Props>,
) {
  const classRoot = post ? "blog_post" : "blog_page";
  return (
    <div className={classRoot}>
      {cover && (
        <div
          className={`${classRoot}_cover_bg`}
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div
        className={`${classRoot}_header`}
        style={{ backgroundImage: cover ? `url(${cover})` : "" }}
      >
        <div className={`${classRoot}_header_inner`}>
          {post
            ? (
              <div className="logo_container">
                <Link to="/blog">
                  <div className="logo">
                    <BfLogo
                      boltColor="white"
                      foundryColor="white"
                    />
                  </div>
                  <div className="logo_text">Open mic</div>
                </Link>
              </div>
            )
            : (
              <div className="logo_container">
                <div className="logo">
                  <BfLogo
                    boltColor="var(--text)"
                    foundryColor="var(--text)"
                  />
                </div>
                <div className="logo_text">Open mic</div>
              </div>
            )}
        </div>
      </div>
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
          <div
            key={post.id}
            className="blog_list_item"
            onClick={() => window.location.href = `/blog/${post.slug}`}
            style={{ backgroundImage: `url(${post.coverUrl})` }}
          >
            <div className="blog_list_item_title">{post.title}</div>
            <div className="blog_list_item_post">
              <div className="blog_author">
                <div
                  className="blog_author_avatar"
                  style={{ backgroundImage: `url(${post.author?.avatarUrl})` }}
                />
                <div>{post.author?.name}</div>
              </div>
              <div className="blog_post_meta">{posts[0]?.date}</div>
            </div>
          </div>
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
          date
          author {
            name
            email
            avatarUrl
          }
          coverUrl
          icon
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

function RichText({ richText }) {
  return richText.map((textBlock) => {
    const { bold, code, color, italic, strikethrough, underlined } =
      textBlock.annotations;
    const classList = classnames([
      "richText",
      { bold },
      { code },
      { italic },
      { strikethrough },
      { underlined },
    ]);
    return (
      <span
        className={classList}
        style={{ color }}
        key={textBlock.text.content}
      >
        {textBlock.text.content}
      </span>
    );
  });
}

function BlogPost() {
  const { slug } = useRouter().routeParams;
  const { currentViewer } = useLazyLoadQuery<BlogPagePostQuery>(query, {
    slug,
  });
  const posts = currentViewer?.blog?.posts?.nodes || [];
  logger.debug("POSTS", posts);
  return (
    <ContentFrame cover={posts[0].coverUrl} post={true}>
      <div className="blog_post_content">
        <h1 className="blog_post_title">{posts[0]?.title}</h1>
        <div className="blog_author">
          <div
            className="blog_author_avatar"
            style={{ backgroundImage: `url(${posts[0]?.author?.avatarUrl})` }}
          />
          <div>{posts[0]?.author?.name}</div>
        </div>
        {/* <div>{posts[0]?.author?.email}</div> */}
        <div className="blog_meta">{posts[0]?.date}</div>
        {posts[0]?.content.map((content) => {
          if (!content) return;
          if (content.type === "paragraph") {
            return (
              <p key={content.id}>
                <RichText richText={content.RichText} />
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
                <div
                  className="blog_callout_inner"
                  style={{ backgroundColor: content.color }}
                >
                  <div className="blog_callout_icon">{content.icon}</div>
                  <div style={{ flex: 1 }}>
                    <RichText richText={content.RichText} />
                  </div>
                </div>
              </div>
            );
          }
          if (content.type === "code") {
            return (
              <div
                key={content.id}
                className="blog_code"
                style={{ backgroundColor: content.color }}
              >
                <RichText richText={content.RichText} />
              </div>
            );
          }
        })}
      </div>
    </ContentFrame>
  );
}
