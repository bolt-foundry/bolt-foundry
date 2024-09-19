import { useFragment, useLazyLoadQuery } from "react-relay";
import { getLogger } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import type { BlogPostContentFragment$key } from "packages/__generated__/BlogPostContentFragment.graphql.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BlogPageHero } from "packages/client/components/blog/BlogPageHero.tsx";

const logger = getLogger(import.meta);
const fragment = await graphql`
fragment BlogPageContentFragment on Blog {
  posts(first: 10, status: "Ready for publish") {
    nodes {
      ...BlogPageHeroFragment
      ...BlogPostContentFragment
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
    }
  }
}
`;

type Props = {
  blogRef: BlogPostContentFragment$key;
};

export function BlogPageContent({ blogRef }: Props) {
  const data = useFragment(fragment, blogRef);
  const posts = data.posts?.nodes || [];

  const blogPostList: JSX.Element[] = [];
  posts.forEach((post: BlogPostContentFragment$key, index: number) => {
    const leftOrRightSideOfPage: string = index % 2 === 0
      ? "blog-page-list-item-right"
      : "blog-page-list-item-left";
    if (index === 0) {
      blogPostList.push(<BlogPageHero key={index} postRef={post} />);
      //inserts our call to action after every third post or at the end of the list.
    } else if (index % 3 === 0 || index === (posts.length - 1)) {
      blogPostList.push(
        <BlogPageListItem
          key={index}
          postRef={post}
          additionalClassName={leftOrRightSideOfPage}
        />,
      );
      blogPostList.push(<BlogPageCta />);
    } else {
      blogPostList.push(
        <BlogPageListItem
          key={index}
          postRef={post}
          additionalClassName={leftOrRightSideOfPage}
        />,
      );
    }
  });

  return blogPostList;
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
