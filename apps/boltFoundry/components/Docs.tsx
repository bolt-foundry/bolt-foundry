import { useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "apps/boltFoundry/pages/PageError.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { marked } from "marked";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { DocsSidebar } from "apps/boltFoundry/components/DocsSidebar.tsx";

const _logger = getLogger(import.meta);

const NavButtons = () => {
  return (
    <>
      <BfDsButton
        kind="dan"
        href="https://boltfoundry.substack.com/"
        hrefTarget="_blank"
        rel="noopener noreferrer"
        text="Blog"
      />
      <BfDsButton kind="danSelected" link="/docs" text="Docs" />
      <BfDsButton
        kind="dan"
        href="https://discord.gg/tU5ksTBfEj"
        hrefTarget="_blank"
        rel="noopener noreferrer"
        text="Discord"
      />
      {
        /* <BfDsButton
      kind="outline"
      text="Login"
      onClick={() => navigate("/login")}
    /> */
      }
    </>
  );
};

export const Docs = iso(`
  field Query.Docs($slug: String) @component {
    documentsBySlug(slug: $slug) {
      id
      content
    }
  }
`)(function Docs({ data, parameters }) {
  const { navigate } = useRouter();
  const [hoverLogo, setHoverLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const blogPost = data.documentsBySlug;
  const currentSlug = parameters.slug || "README";

  if (!blogPost) {
    return <PageError error={new Error(`Documentation page not found`)} />;
  }

  // Convert markdown to HTML
  const htmlContent = marked(blogPost.content) as string;

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
      {/* Docs Content */}
      <section className="docs-section">
        <div className="landing-content">
          <div className="docs-layout">
            <DocsSidebar currentSlug={currentSlug} />
            <main className="docs-main">
              <article
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </main>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium">
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
