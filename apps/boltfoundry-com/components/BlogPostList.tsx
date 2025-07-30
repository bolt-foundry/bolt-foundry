import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsPill } from "@bfmono/apps/bfDs/components/BfDsPill.tsx";
import { blogMetadata } from "../lib/blogHelper.ts";

// Blog list component for QueryBlogPostsConnection
export const BlogPostList = iso(`
  field QueryBlogPostsConnection.BlogPostList @component {
    edges {
      cursor
      node {
        id
        author
        publishedAt
        excerpt
        tags
        title
        heroImage
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
`)(function BlogPostList({ data }) {
  if (!data || !data.edges) {
    return <div>No blog posts found.</div>;
  }

  const connection = data;
  const edges = connection.edges!; // Non-null assertion since we checked above

  return (
    <main className="blog-main">
      <div className="blog-list">
        <h1>Blog Posts</h1>
        <div className="blog-posts">
          {edges.map((edge) => {
            if (!edge || !edge.node) return null;
            const {
              id,
              author,
              publishedAt,
              excerpt,
              tags,
              title,
              heroImage,
            } = edge.node;

            const metadata = blogMetadata(author, publishedAt);
            const previewImage = heroImage;
            const tagsArray = tags ? JSON.parse(tags) : [];
            const renderTags = tagsArray.map((tag: string) => (
              <BfDsPill
                variant="primary"
                text={tag}
                key={tag}
              />
            ));

            return (
              <article
                key={edge.cursor}
                className="blog-post-preview paper"
                style={{
                  marginBottom: "2rem",
                }}
              >
                <div className="rowReverse-column gapLarge">
                  {previewImage && (
                    <img
                      className="blog-list-hero-image"
                      src={previewImage}
                      alt={title}
                    />
                  )}
                  <div className="flex1">
                    <h2 style={{ marginTop: 0 }}>
                      <a
                        href={`/blog/${id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {title}
                      </a>
                    </h2>
                    {(metadata || renderTags.length > 0) && (
                      <div className="metadata flexRow gapMedium flexWrap">
                        {metadata ?? ""}
                        {renderTags}
                      </div>
                    )}
                    {excerpt && (
                      <p style={{ marginTop: "1rem" }}>
                        {excerpt}
                      </p>
                    )}
                    <a
                      href={`/blog/${id}`}
                      style={{ color: "var(--link)", textDecoration: "none" }}
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {connection.pageInfo.hasNextPage && (
          <div style={{ marginTop: "2rem" }}>
            <BfDsButton
              variant="primary"
              disabled
            >
              Load more posts
            </BfDsButton>
          </div>
        )}
      </div>
    </main>
  );
});
