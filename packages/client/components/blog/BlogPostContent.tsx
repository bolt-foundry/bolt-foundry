import { useFragment } from "react-relay";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { classnames } from "lib/classnames.ts";
import { BlogFrame } from "packages/client/components/blog/BlogFrame.tsx";
import { BlogPostContentFragment$key } from "packages/__generated__/BlogPostContentFragment.graphql.ts";
import { BlogPostStatus } from "packages/client/components/blog/BlogPostStatus.tsx";
import { BlogCta } from "packages/client/components/blog/BlogCta.tsx";

const logger = getLogger(import.meta);

const fragment = await graphql`
fragment BlogPostContentFragment on BlogPost {
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
  callToAction {
    annotations {
      bold
      code
      color
      italic
      strikethrough
      underlined
    }
    text {
      content
      link {
        url
      }
    }
    type
  }
  content {
    ... on ParagraphBlock {
      id
      type
      color
      RichText {
        text {
          content
          link {
            url
          }
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
    ... on HeadingBlock {
      id
      type
      size
      color
      isToggleable
      RichText {
        text {
          content
          link {
            url
          }
        }
        annotations {
          bold
          code
          color
          italic
          strikethrough
          underlined
        }
        type
      }
    }
    ... on ImageBlock {
      id
      type
      imgUrl
      caption {
        text {
          content
          link {
            url
          }
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
          link {
            url
          }
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
          link {
            url
          }
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
    const link = textBlock.text?.link?.url;
    return link
      ? (
        <a
          href={link}
          target="_blank"
          className={classList}
          style={{ color }}
          key={textBlock.text.content}
        >
          {textBlock.text.content}
        </a>
      )
      : (
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
  postRef: BlogPostContentFragment$key;
  additionalClassName?: string;
};

export function BlogPostContent({ postRef }: PostProps) {
  const post = useFragment(fragment, postRef);
  logger.debug("POST", post);
  let ctaChildren;
  if (post?.callToAction.length > 0) {
    ctaChildren = <RichText richText={post?.callToAction} />;
  }
  return (
    <BlogFrame cover={post?.coverUrl} post={true}>
      <div className="blog_post_content">
        <h1 className="blog_post_title">
          {post?.title}
          <BlogPostStatus status={post?.status} />
        </h1>
        <div className="blog_author">
          <div
            className="blog_author_avatar"
            style={{ backgroundImage: `url(${post?.author?.avatarUrl})` }}
          />
          <div>{post?.author?.name}</div>
        </div>
        {/* <div>{post?.author?.email}</div> */}
        <div className="blog_meta">{post?.date}</div>
        {post?.content?.map((content) => {
          if (!content) return;
          if (content.type === "heading") {
            if (content.size === "1") {
              return (
                <h1 key={content.id}>
                  <RichText richText={content.RichText} />
                </h1>
              );
            }
            if (content.size === "2") {
              return (
                <h2 key={content.id}>
                  <RichText richText={content.RichText} />
                </h2>
              );
            }
            if (content.size === "3") {
              return (
                <h3 key={content.id}>
                  <RichText richText={content.RichText} />
                </h3>
              );
            }
          }
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
                alt={content.caption?.[0]?.text?.content || ""}
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
                  style={{ backgroundColor: content.color ?? "white" }}
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
        <BlogCta>
          {ctaChildren}
        </BlogCta>
      </div>
    </BlogFrame>
  );
}
