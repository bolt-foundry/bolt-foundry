import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { Nav } from "./Nav.tsx";

const _logger = getLogger(import.meta);

// Main Blog component that switches between list and single post
export const Blog = iso(`
  field Query.Blog @component {
    blogPosts(first: 10) {
      BlogPostList
    }
  }
`)(function Blog({ data, parameters = {} }) {
  const hasSlug = Boolean(parameters?.slug);

  // If data is not available, show loading
  if (!data) {
    return (
      <div className="landing-page">
        <Nav page="blog" />
        <section className="docs-section">
          <div className="landing-content">
            <div className="blog-layout">
              <div>Loading...</div>
            </div>
          </div>
        </section>
      </div>
    );
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
              ? <div>Individual blog posts coming soon...</div>
              : (data.blogPosts
                ? <data.blogPosts.BlogPostList />
                : <div>Loading blog posts...</div>)}
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              size="small"
              variant="ghost"
              icon="brand-discord"
              iconOnly
              href="https://discord.gg/tU5ksTBfEj"
              target="_blank"
            />
            <BfDsButton
              size="small"
              variant="ghost"
              icon="brand-github"
              iconOnly
              href="https://github.com/bolt-foundry/bolt-foundry"
              target="_blank"
            />
          </div>
        </div>
      </section>
    </div>
  );
});
