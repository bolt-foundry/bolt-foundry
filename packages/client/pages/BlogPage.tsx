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
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

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
          <div className="logo_container">
            <Link to="/">
              <BfLogo
                boltColor={post ? "white" : "var(--text)"}
                foundryColor={post ? "white" : "var(--text)"}
              />
            </Link>
          </div>
          <BlogNavbar />
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

  const blogPostList: JSX.Element[] = [];
  posts.forEach((post: BlogPagePostFragment$key, index: number) => {
    const leftOrRightSideOfPage: string = index % 2 === 0
      ? "blog-page-list-item-right"
      : "blog-page-list-item-left";
    if (index === 0) {
      blogPostList.push(<BlogPageHero postRef={post} />);
      //inserts our call to action after every third post or at the end of the list.
    } else if (index % 3 === 0 || index === (posts.length - 1)) {
      blogPostList.push(
        <BlogPageListItem
          postRef={post}
          additionalClassName={leftOrRightSideOfPage}
        />,
      );
      blogPostList.push(<BlogPageCta />);
    } else {
      blogPostList.push(
        <BlogPageListItem
          postRef={post}
          additionalClassName={leftOrRightSideOfPage}
        />,
      );
    }
  });

  return (
    <ContentFrame>
      <div className="blog_list">
        {blogPostList}
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

function BlogNavbar() {
  return (
    <div className="blog-navbar">
      <Link to="/blog">Blog</Link>
      {/* <Link to="/about">About</Link> */}
      <BfDsButton
        href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
        hrefTarget="blank"
        text="Let's talk"
        size="large"
      />
    </div>
  );
}

function BlogPageHero({ postRef }: PostProps) {
  const post = useFragment(fragment, postRef);
  const { navigate } = useRouter();
  return (
    <div
      key={post.id}
      className="blog-page-hero"
      onClick={() => navigate(`/blog/${post.slug}`)}
      style={{ backgroundImage: `url(${post.coverUrl})` }}
    >
      <div className="blog-hero-info">
        <div className="blog-page-hero-title">
          <div>{post.title}</div>
        </div>
        <div className="blog_author blog-hero-author">
          <div
            className="blog_author_avatar"
            style={{ backgroundImage: `url(${post?.author?.avatarUrl})` }}
          />
          <div>{post?.author?.name}</div>
        </div>
        {/* <div>{post?.author?.email}</div> */}
        <div className="blog_meta">{post?.date}</div>
        <div className="blog-page-hero-summary">{post.summary}</div>
      </div>
    </div>
  );
}

function BlogPageListItem({ postRef, additionalClassName }: PostProps) {
  const post = useFragment(fragment, postRef);
  const { navigate } = useRouter();
  let coverImage;
  if (post.coverUrl) {
    coverImage = (
      <img
        className="blog-list-item-image"
        src={post.coverUrl}
        alt="Cover Image"
      />
    );
  } else {
    coverImage = (
      <div className="blog-list-item-image-placeholder blog-list-item-image-placeholder-fourthary">
        <div style={{ width: "50%" }}>
          <BfSymbol color="white" />
        </div>
      </div>
    );
  }
  return (
    <div
      key={post.id}
      className={`blog-page-list-item ${additionalClassName || ""}`}
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <div className="blog-page-item-info">
        <div className="blog-list-item-title">{post.title}</div>
        <div className="blog_author">
          <div
            className="blog_author_avatar"
            style={{ backgroundImage: `url(${post?.author?.avatarUrl})` }}
          />
          <div>{post?.author?.name}</div>
        </div>
        {/* <div>{post?.author?.email}</div> */}
        <div className="blog_meta">{post?.date}</div>
        <div className="blog-list-item-summary">{post.summary}</div>
      </div>
      {coverImage}
    </div>
  );
}

function BlogPageCta() {
  return (
    <div className="blog-page-cta">
      <div className="blog-page-cta-text-area">
        It's your content, get the most from it.
        <div className="blog-page-cta-cta">
          Schedule to see how Bolt Foundry can help!
        </div>
      </div>
      <div className="blog-page-lets-talk-button">
        <BfDsButton
          href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
          hrefTarget="blank"
          text="Let's talk"
          size="xlarge"
        />
      </div>
    </div>
  );
}

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
