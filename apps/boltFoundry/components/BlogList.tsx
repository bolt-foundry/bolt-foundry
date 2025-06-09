import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { RouterLink } from "apps/boltFoundry/components/Router/RouterLink.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";

// Blog list component for BlogPostConnection
export const BlogList = iso(`
  field BlogPostConnection.BlogList @component {
    edges {
      cursor
      node {
        id
        content
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

  // Extract title and date from markdown content
  const extractMetadata = (content: string, id: string) => {
    // const lines = content.split("\n");
    let title = id.replace(/-/g, " ").replace(/^\d{4} \d{2} /, "");
    let date = "";
    let excerpt = "";

    // Look for title (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];
    }

    // Look for date (italic text starting with date pattern)
    const dateMatch = content.match(/^_([A-Za-z]+ \d{1,2}, \d{4})_$/m);
    if (dateMatch) {
      date = dateMatch[1];
    }

    // Extract excerpt (first paragraph after title and date)
    const excerptMatch = content.match(/^[^#\n_].*$/m);
    if (excerptMatch) {
      excerpt = excerptMatch[0].substring(0, 200) +
        (excerptMatch[0].length > 200 ? "..." : "");
    }

    return { title, date, excerpt };
  };

  return (
    <main className="blog-main">
      <div className="blog-list">
        <h1>Blog Posts</h1>
        <div className="blog-posts">
          {edges.map((edge) => {
            if (!edge || !edge.node) return null;
            const { id, content } = edge.node;
            const { title, date, excerpt } = extractMetadata(content, id);
  
            return (
              <article
                key={edge.cursor}
                className="blog-post-preview paper"
                style={{
                  marginBottom: "2rem",
                }}
              >
                <h2 style={{ marginTop: 0 }}>
                  <RouterLink
                    to={`/blog/${id}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {title}
                  </RouterLink>
                </h2>
                {date && (
                  <time style={{ color: "var(--textDim)", fontSize: "0.9rem" }}>
                    {date}
                  </time>
                )}
                {excerpt && <p style={{ marginTop: "1rem" }}>{excerpt}</p>}
                <RouterLink
                  to={`/blog/${id}`}
                  style={{ color: "var(--link)", textDecoration: "none" }}
                >
                  Read more →
                </RouterLink>
              </article>
            );
          })}
        </div>
        {connection.pageInfo.hasNextPage && (
          <div style={{ marginTop: "2rem" }}>
            <BfDsButton
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
