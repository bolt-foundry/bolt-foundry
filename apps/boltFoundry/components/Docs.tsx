import { useEffect, useRef, useState } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "@bfmono/apps/boltFoundry/pages/PageError.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { marked, Renderer } from "marked";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { DocsSidebar } from "@bfmono/apps/boltFoundry/components/DocsSidebar.tsx";
import { Nav } from "@bfmono/apps/boltFoundry/components/Nav.tsx";

const _logger = getLogger(import.meta);

export const Docs = iso(`
  field Query.Docs($slug: String) @component {
    documentsBySlug(slug: $slug) {
      id
      content
    }
  }
`)(function Docs({ data, parameters }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);
  const blogPost = data.documentsBySlug;
  const currentSlug = parameters.slug || "README";

  useEffect(() => {
    if (docRef.current) {
      docRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSlug]);

  if (!blogPost) {
    return <PageError error={new Error(`Documentation page not found`)} />;
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

  // Make external links open in new tab and fix internal doc links
  renderer.link = function (href: string, title: string | null, text: string) {
    const isExternal = href.startsWith("http://") ||
      href.startsWith("https://");
    const isAnchor = href.startsWith("#");
    const isAbsolute = href.startsWith("/");

    let finalHref = href;
    // Remove file extension if present (e.g., .md, .mdx)
    const hrefWithoutExtension = href.replace(/\.(md|mdx)$/, "");

    // For absolute paths, use the href without extension
    if (isAbsolute) {
      finalHref = hrefWithoutExtension;
    }

    // For internal links that aren't anchors or absolute paths, prefix with /docs/
    if (!isExternal && !isAnchor && !isAbsolute) {
      finalHref = `/docs/${hrefWithoutExtension}`;
    }

    const titleAttr = title ? ` title="${title}"` : "";
    const target = isExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";

    return `<a href="${finalHref}"${titleAttr}${target}>${text}</a>`;
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

  const sidebarAnimation = {
    transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease-in-out",
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <Nav page="docs" />
      {/* Docs Content */}
      <section className="docs-section" ref={docRef}>
        <div className="landing-content">
          <div className="docs-layout">
            <div
              className="mobile-show sidebar-container"
              style={sidebarAnimation}
            >
              <DocsSidebar
                currentSlug={currentSlug}
                setShowSidebar={setShowSidebar}
              />
            </div>
            <DocsSidebar
              currentSlug={currentSlug}
              setShowSidebar={setShowSidebar}
              xClassName="mobile-hide"
            />
            <div className="mobile-show docs-navbar">
              <div className="flexRow gapMedium alignItemsCenter">
                <BfDsButton
                  kind={showSidebar ? "primary" : "secondary"}
                  iconLeft={showSidebar ? "sidebarClose" : "sidebarOpen"}
                  onClick={() => {
                    setShowSidebar(!showSidebar);
                  }}
                  size="medium"
                />
                <div
                  className="flex1"
                  onClick={() => {
                    setShowSidebar(!showSidebar);
                  }}
                >
                  {currentSlug}
                </div>
              </div>
            </div>
            <main className="docs-main paper">
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
