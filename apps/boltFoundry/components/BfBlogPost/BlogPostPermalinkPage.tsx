import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BlogFrame } from "apps/boltFoundry/components/BfBlog/BlogFrame.tsx";
import { use } from "react";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const loadingPromises = new Map<string, Promise<React.FC>>();

function getComponent(
  path: string,
): Promise<React.FC> {
  logger.debug(`getComponent(${path})`);
  if (loadingPromises.has(path)) {
    return loadingPromises.get(path)!;
  }
  let gettablePath = `build/content${path}`;
  if (typeof Deno === "undefined") {
    const regexForMdAndMdx = /\.mdx?$/;
    gettablePath = `/static/${gettablePath.replace(regexForMdAndMdx, ".js")}`;
  }
  const nextPromise = new Promise<React.FC>((resolve) => {
    import(gettablePath).then((module) => {
      resolve(module.default as React.FC);
    });
  });
  loadingPromises.set(path, nextPromise);
  return nextPromise;
}

function useContent(path: string | null) {
  if (path) {
    const Component = use(getComponent(path));
    return <Component />;
  }
  return null;
}

export const BlogPostPermalinkPage = iso(`
  field BfBlogPost.BlogPostPermalinkPage @component {
    __typename
    title
    author
    summary
    cta
    href
    content
  }
`)(function BlogPostPermalinkPage({ data }) {
  logger.debug("BlogPostPermalinkPage data:", data);

  // Try to render the MDX/MD content first
  const contentElement = useContent(data.href);

  return (
    <BlogFrame post>
      <div className="blog-post-container">
        <article className="blog-post">
          <header className="blog-post-header">
            <h1>{data.title || "Untitled"}</h1>
            {data.author && (
              <p className="blog-post-author">By {data.author}</p>
            )}
            {data.summary && (
              <p className="blog-post-summary">{data.summary}</p>
            )}
          </header>

          <div className="blog-post-content">
            {contentElement || (
              // Fallback to display raw content if MDX/MD rendering fails
              <div dangerouslySetInnerHTML={{ __html: data.content || "" }} />
            )}
          </div>

          <footer className="blog-post-footer">
            {data.cta && <p className="blog-post-cta">{data.cta}</p>}
          </footer>
        </article>
      </div>
    </BlogFrame>
  );
});

export const BlogPostTitleForHeader = iso(`
  field BfBlogPost.BlogPostTitleForHeader {
    title
  }
`)(function BlogPostTitleForHeader({ data }) {
  return data.title || "Blog Post";
});
