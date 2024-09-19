import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import type { BlogPostContentFragment$key } from "packages/__generated__/BlogPostContentFragment.graphql.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";

const fragment = await graphql`
fragment BlogPageListItemFragment on BlogPost {
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
`;

type PostProps = {
  postRef: BlogPostContentFragment$key;
  additionalClassName?: string;
};

export function BlogPageListItem({ postRef, additionalClassName }: PostProps) {
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
