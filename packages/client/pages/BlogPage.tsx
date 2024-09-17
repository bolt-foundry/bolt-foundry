import type * as React from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { classnames } from "lib/classnames.ts";
import { Link } from "packages/bfDs/Link.tsx";
import type { BlogPageQuery } from "packages/__generated__/BlogPageQuery.graphql.ts";
import type { BlogPagePostFragment$key } from "packages/__generated__/BlogPagePostFragment.graphql.ts";

const logger = getLogger(import.meta);

const pageQuery = await graphql`
  query BlogPageQuery {
    currentViewer {
      blog {
        posts(first: 10, status: "Ready for publish") {
          nodes {
            ...BlogPagePostFragment
            id
            title
            slug
            date
            summary
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
  const { navigate, routeParams } = useRouter();
  const data = useLazyLoadQuery<BlogPageQuery>(
    pageQuery,
    {},
  );
  const posts = data.currentViewer?.blog?.posts?.nodes || [];

  if (routeParams.slug) {
    const post = posts.find((post) =>
      post.slug === routeParams.slug
    ) as BlogPagePostFragment$key;
    return <BlogPost postRef={post} />;
  }

  return (
    <ContentFrame>
      <div className="blog_list">
        {posts.map((post) => (
          <div
            key={post.id}
            className="blog_list_item"
            onClick={() => navigate(`/blog/${post.slug}`)}
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
              <div className="blog_post_meta">{post?.date}</div>
            </div>
          </div>
        ))}
      </div>
    </ContentFrame>
  );
}

const fragment = await graphql`
fragment BlogPagePostFragment on BlogPost {
  id
  title
  slug
  status
  date
  summary
  author {
    name
    email
    avatarUrl
  }
  coverUrl
  icon
  content {
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

type PostProps = {
  postRef: BlogPagePostFragment$key;
  additionalClassName?: string;
};

export function BlogPost({ postRef }: PostProps) {
  const { routeParams: { slug } } = useRouter();
  const post = useFragment(fragment, postRef);
  logger.debug("POST", post);
  return (
    <ContentFrame cover={post?.coverUrl} post={true}>
      <div className="blog_post_content">
        <h1 className="blog_post_title">{post?.title}</h1>
        <div className="blog_author">
          <div
            className="blog_author_avatar"
            style={{ backgroundImage: `url(${post?.author?.avatarUrl})` }}
          />
          <div>{post?.author?.name}</div>
        </div>
        {/* <div>{post?.author?.email}</div> */}
        <div className="blog_meta">{post?.date}</div>
        {post?.content.map((content) => {
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
