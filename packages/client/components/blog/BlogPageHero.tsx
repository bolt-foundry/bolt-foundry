import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { BlogPostContentFragment$key } from "packages/__generated__/BlogPostContentFragment.graphql.ts";

const fragment = await graphql`
fragment BlogPageHeroFragment on BlogPost {
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

type Props = {
  postRef: BlogPostContentFragment$key;
  additionalClassName?: string;
};

export function BlogPageHero({ postRef }: Props) {
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
