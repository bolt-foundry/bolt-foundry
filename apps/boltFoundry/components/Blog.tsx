import { useEffect, useRef, useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "apps/boltFoundry/pages/PageError.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { marked, Renderer } from "marked";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";

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

export const Blog = iso(`
  field Query.Blog($slug: String) @component {
    blogPost(slug: $slug) {
      id
      content
    }
  }
`)(function Blog({ data, parameters }) {
  const { navigate } = useRouter();
  const [hoverLogo, setHoverLogo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);
  const blogPost = data.blogPost;
  const currentSlug = parameters.slug || "README";

  useEffect(() => {
    if (docRef.current) {
      docRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSlug]);

  if (!blogPost) {
    return <PageError error={new Error(`Blog post not found`)} />;
  }

  // Convert markdown to HTML
  const renderer = new Renderer();
  renderer.table = function (header: string, body: string) {
    return `<div class="table-wrapper"><table>${header}${body}</table></div>`;
  };

  // Add IDs to headings for anchor links
  renderer.heading = function (text: string, level: number) {
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();

    return `<h${level} id="${id}">${text}</h${level}>`;
  };

  // Make external links open in new tab
  renderer.link = function (href: string, title: string | null, text: string) {
    const isExternal = href.startsWith("http://") ||
      href.startsWith("https://");
    const titleAttr = title ? ` title="${title}"` : "";
    const target = isExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";

    return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
  };

  const htmlContent = marked(blogPost.content, { renderer }) as string;

  // Handle anchor link clicks
  useEffect(() => {
    const handleAnchorClick = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.href.includes("#")) {
        const hash = target.getAttribute("href");
        if (hash?.startsWith("#")) {
          event.preventDefault();
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    if (docRef.current) {
      docRef.current.addEventListener("click", handleAnchorClick);
      return () => {
        docRef.current?.removeEventListener("click", handleAnchorClick);
      };
    }
  }, [htmlContent]);

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
      <section className="docs-section" ref={docRef}>
        <div className="landing-content">
          <div className="blog-layout">
            <main className="blog-main">
              <article
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
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
