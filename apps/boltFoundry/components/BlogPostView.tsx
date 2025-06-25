import { useEffect, useRef } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { PageError } from "@bfmono/apps/boltFoundry/pages/PageError.tsx";
import { marked, Renderer } from "marked";
import { blogMetadata } from "@bfmono/apps/boltFoundry/lib/blogHelper.ts";
import { CfDsPill } from "@bfmono/apps/cfDs/components/CfDsPill.tsx";

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

  // Use the hero image from GraphQL for hero display
  const heroImage = blogPost.heroImage;
  let firstImageSkipped = false;

  let firstH1Skipped = false;
  // Skip first image from content since we'll display it as hero
  renderer.image = function (href: string, title: string | null, text: string) {
    // Skip the first image in content since we'll display it as hero
    if (href === heroImage && !firstImageSkipped) {
      firstImageSkipped = true;
      return "";
    }

    // For subsequent images, render normally
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img class="blog-post-image" src="${href}" alt="${text}"${titleAttr} />`;
  };

  renderer.heading = function (text: string, level: number) {
    // Skip the first h1 heading since we'll display the title separately
    if (level === 1 && !firstH1Skipped) {
      firstH1Skipped = true;
      return "";
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
              <CfDsPill
                key={tag}
                color="primaryColor"
                labelColor="textSecondary"
                label={tag}
              />
            ))}
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </main>
  );
});
