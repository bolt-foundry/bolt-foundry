import { useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { BlogSimple } from "./BlogSimple.tsx";

const _logger = getLogger(import.meta);

const NavButtons = () => {
  return (
    <>
      <BfDsButton
        kind="danSelected"
        href="/blog"
        text="Blog"
      />
      <BfDsButton
        kind="dan"
        href="/docs"
        text="Docs"
      />
      <BfDsButton
        kind="dan"
        href="https://discord.gg/tU5ksTBfEj"
        hrefTarget="_blank"
        rel="noopener noreferrer"
        text="Discord"
      />
    </>
  );
};

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
  const { navigate } = useRouter();
  const [hoverLogo, setHoverLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hasSlug = Boolean(parameters?.slug);

  // During SSR or when data is not available, use the simple component
  if (typeof window === "undefined" || !data) {
    return <BlogSimple slug={parameters?.slug ?? undefined} />;
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-content flexRow gapLarge">
          <div className="flex1 flexRow alignItemsCenter">
            <div
              className="header-logo clickable"
              onClick={() => navigate("/")}
              onMouseEnter={() => setHoverLogo(true)}
              onMouseLeave={() => setHoverLogo(false)}
            >
              <BfLogo
                boltColor={hoverLogo ? "var(--primaryColor)" : "var(--text)"}
                foundryColor={hoverLogo ? "var(--primaryColor)" : "var(--text)"}
                height={24}
              />
            </div>
          </div>
          <div className="mobile-hide">
            <nav className="alignItemsCenter flexRow gapLarge header-nav">
              <NavButtons />
            </nav>
          </div>
          <nav className="mobile-show">
            <BfDsButton
              kind="dan"
              iconLeft="menu"
              onClick={() => {
                setShowMenu(true);
              }}
            />
          </nav>
          {showMenu && (
            <div className="mobile-show">
              <div className="flexColumn gapLarge sidebar-nav">
                <div className="selfAlignEnd">
                  <BfDsButton
                    kind="dan"
                    iconLeft="cross"
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  />
                </div>
                <NavButtons />
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Blog Content */}
      <section className="docs-section">
        <div className="landing-content">
          <div className="blog-layout">
            <main className="blog-main">
              {hasSlug
                ? (data.blogPost
                  ? <data.blogPost.BlogPostView />
                  : <div>Blog post not found</div>)
                : (data.blogPosts
                  ? <data.blogPosts.BlogList />
                  : <div>Loading blog posts...</div>)}
            </main>
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
