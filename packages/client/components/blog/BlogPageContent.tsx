import { useFragment } from "react-relay";
import { getLogger } from "packages/logger/logger.ts";
import { graphql } from "packages/client/deps.ts";
import type { BlogPostContentFragment$key } from "packages/__generated__/BlogPostContentFragment.graphql.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BlogPageHero } from "packages/client/components/blog/BlogPageHero.tsx";
import { BlogPageContentFragment$key } from "packages/__generated__/BlogPageContentFragment.graphql.ts";
import { BlogPageListItem } from "packages/client/components/blog/BlogPageListItem.tsx";
import { BlogCta } from "packages/client/components/blog/BlogCta.tsx";

// const logger = getLogger(import.meta);
const fragment = await graphql`
fragment BlogPageContentFragment on Blog
@argumentDefinitions(status: { type: "[PostStatus!]" }) {
  posts(first: 10, status: $status) @connection(key: "Blog_posts") {
    edges {
      node {
        ...BlogPageHeroFragment
        ...BlogPostContentFragment
        ...BlogPageListItemFragment
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
}
`;

type Props = {
  blogRef: BlogPageContentFragment$key | null;
};

export function BlogPageContent({ blogRef }: Props) {
  const data = useFragment(fragment, blogRef);
  const posts = data?.posts?.edges?.map((edge) => edge?.node).filter(Boolean) ??
    [];

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
      blogPostList.push(<BlogCta />);
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

  return <>{blogPostList}</>;
}
