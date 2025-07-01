import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { RouterLink } from "@bfmono/apps/boltFoundry/components/Router/RouterLink.tsx";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { blogMetadata } from "@bfmono/apps/boltFoundry/lib/blogHelper.ts";
import { CfDsPill } from "@bfmono/apps/cfDs/components/CfDsPill.tsx";

// Blog list component for BlogPostConnection
export const BlogList = iso(`
  field BlogPostConnection.BlogList @component {
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
`)(function BlogList({ data }) {
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
              <CfDsPill
                color="primaryColor"
                labelColor="textSecondary"
                label={tag}
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
                      <RouterLink
                        to={`/blog/${id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {title}
                      </RouterLink>
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
                    <RouterLink
                      to={`/blog/${id}`}
                      style={{ color: "var(--link)", textDecoration: "none" }}
                    >
                      Read more →
                    </RouterLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {connection.pageInfo.hasNextPage && (
          <div style={{ marginTop: "2rem" }}>
            <CfDsButton
              kind="dan"
              text="Load more posts"
              disabled
            />
          </div>
        )}
      </div>
    </main>
  );
});
