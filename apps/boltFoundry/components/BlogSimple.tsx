import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "@bfmono/apps/bfDs/static/BfLogo.tsx";
import { useRouter } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";

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

// Simple blog component for SSR compatibility
export const BlogSimple = ({ slug }: { slug?: string }) => {
  const { navigate } = useRouter();
  const [hoverLogo, setHoverLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
              {slug
                ? (
                  <article className="blog-post-preview">
                    <h1>Blog Post</h1>
                    <p>Loading blog post: {slug}</p>
                  </article>
                )
                : (
                  <div className="blog-list">
                    <h1>Blog Posts</h1>
                    <div className="blog-posts">
                      <article className="blog-post-preview">
                        <h2>Welcome to our Blog</h2>
                        <p>Check back soon for more content!</p>
                      </article>
                    </div>
                  </div>
                )}
            </main>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              kind="dan"
              href="mailto:hello@boltfoundry.com"
              text="Contact"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
