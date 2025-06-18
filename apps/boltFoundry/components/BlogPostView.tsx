import { useEffect, useRef } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "apps/boltFoundry/pages/PageError.tsx";
import { marked, Renderer } from "marked";
import { blogMetadata } from "apps/boltFoundry/lib/blogHelper.ts";

// Single blog post view component
export const BlogPostView = iso(`
  field BlogPost.BlogPostView @component {
    id
    content
    author
    publishedAt
    tags
  }
`)(function BlogPostView({ data }) {
  const docRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return <PageError error={new Error(`Blog post not found`)} />;
  }

  const blogPost = data;

  // Convert markdown to HTML
  const renderer = new Renderer();
  renderer.table = function (header: string, body: string) {
    return `<div class="table-wrapper"><table>${header}${body}</table></div>`;
  };

  // Add IDs to headings for anchor links
  const metadata = blogMetadata(
    blogPost.author,
    blogPost.publishedAt,
  );
  const tagsArray = blogPost.tags ? JSON.parse(blogPost.tags) : [];
  const renderTags = tagsArray.map((tag: string) => (
    `<div class="ds-pill" style="background: var(--primaryColor015)">
  <div class="ds-pillLabel noText" style="color: var(--textSecondary)">
    ${tag}
  </div>
</div>`
  ));
  let metadataShown = false;
  renderer.heading = function (text: string, level: number) {
    // add metadata and tags after the first h1 heading
    if (level === 1 && !metadataShown) {
      metadataShown = true;
      return `<h${level}>${text}</h${level}>
  <div class="metadata flexRow gapMedium">
    ${metadata}
    ${renderTags && `${renderTags.join("")}`}
  </div>`;
    }
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
    <main className="blog-main paper">
      <article
        ref={docRef}
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
});
