import { useEffect, useRef } from "react";
import { iso } from "@iso-bfc";
import { marked, Renderer } from "marked";
import { blogMetadata } from "../lib/blogHelper.ts";
import { BfDsPill } from "@bfmono/apps/bfDs/components/BfDsPill.tsx";

// Single blog post view component
export const BlogPostView = iso(`
  field BlogPost.BlogPostView @component {
    id
    content
    author
    publishedAt
    tags
    title
    heroImage
  }
`)(function BlogPostView({ data }) {
  const docRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return <div>Blog post not found</div>;
  }

  const blogPost = data;

  // Convert markdown to HTML
  const renderer = new Renderer();
  renderer.table = function (
    token: {
      header: Array<{ text: string }>;
      rows: Array<Array<{ text: string }>>;
    },
  ) {
    const headerHtml = token.header.map((cell) => `<th>${cell.text}</th>`).join(
      "",
    );
    const rowsHtml = token.rows.map((row) =>
      `<tr>${row.map((cell) => `<td>${cell.text}</td>`).join("")}</tr>`
    ).join("");
    return `<div class="table-wrapper"><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  };

  // Add IDs to headings for anchor links
  const metadata = blogMetadata(
    blogPost.author,
    blogPost.publishedAt,
  );
  const tagsArray = blogPost.tags ? JSON.parse(blogPost.tags) : [];

  // Use the hero image from GraphQL for hero display
  const heroImage = blogPost.heroImage;
  let firstImageSkipped = false;

  let firstH1Skipped = false;
  // Skip first image from content since we'll display it as hero
  renderer.image = function (
    token: { href: string; title: string | null; text: string },
  ) {
    // Skip the first image in content since we'll display it as hero
    if (token.href === heroImage && !firstImageSkipped) {
      firstImageSkipped = true;
      return "";
    }

    // For subsequent images, render normally
    const titleAttr = token.title ? ` title="${token.title}"` : "";
    return `<img class="blog-post-image" src="${token.href}" alt="${token.text}"${titleAttr} />`;
  };

  renderer.heading = function (
    token: { tokens: Array<{ text?: string; raw?: string }>; depth: number },
  ) {
    const text = token.tokens.map((t) => t.text || t.raw || "").join("");
    // Skip the first h1 heading since we'll display the title separately
    if (token.depth === 1 && !firstH1Skipped) {
      firstH1Skipped = true;
      return "";
    }
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();

    return `<h${token.depth} id="${id}">${text}</h${token.depth}>`;
  };

  // Make external links open in new tab
  renderer.link = function ({ href, title, tokens }: {
    href: string;
    title?: string | null;
    tokens: Array<{ text?: string; raw?: string }>;
  }) {
    const text = tokens.map((t) => t.text || t.raw || "").join("");
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
      <article ref={docRef} className="prose prose-lg">
        {heroImage && (
          <img
            className="blog-post-hero-image"
            src={heroImage}
            alt={blogPost.title}
          />
        )}
        <h1 style={{ marginTop: 0 }}>{blogPost.title}</h1>
        {(metadata || tagsArray.length > 0) && (
          <div
            className="metadata flexRow gapMedium flexWrap"
            style={{ marginBottom: "2rem" }}
          >
            {metadata ?? ""}
            {tagsArray.map((tag: string) => (
              <BfDsPill
                key={tag}
                variant="primary"
                text={tag}
              />
            ))}
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </main>
  );
});
