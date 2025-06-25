import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BlogSimple } from "./BlogSimple.tsx";
import { Nav } from "@bfmono/apps/boltFoundry/components/Nav.tsx";

const _logger = getLogger(import.meta);

// Main Blog component that switches between list and single post
export const Blog = iso(`
  field Query.Blog($slug: String) @component {
    blogPost(slug: $slug) {
      BlogPostView
    }
    blogPosts(first: 10, sortDirection: "DESC") {
      BlogList
    }
  }
`)(function Blog({ data, parameters = {} }) {
  const hasSlug = Boolean(parameters?.slug);

  // If data is not available, use the simple component
  if (!data) {
    return <BlogSimple slug={parameters?.slug ?? undefined} />;
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <Nav page="blog" />
      {/* Blog Content */}
      <section className="docs-section">
        <div className="landing-content">
          <div className="blog-layout">
            {hasSlug
              ? (data.blogPost
                ? <data.blogPost.BlogPostView />
                : <div>Blog post not found</div>)
              : (data.blogPosts
                ? <data.blogPosts.BlogList />
                : <div>Loading blog posts...</div>)}
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-discord"
              href="https://discord.gg/tU5ksTBfEj"
              hrefTarget="_blank"
            />
            <BfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-github"
              href="https://github.com/bolt-foundry/bolt-foundry"
              hrefTarget="_blank"
            />
          </div>
        </div>
      </section>
    </div>
  );
});
