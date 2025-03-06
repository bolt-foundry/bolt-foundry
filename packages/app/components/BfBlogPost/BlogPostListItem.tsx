import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { use } from "react";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

const loadingPromises = new Map<string, Promise<React.FC>>();

function getComponent(
  path: string,
): Promise<React.FC> {
  logger.setLevel(logger.levels.DEBUG);
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

function useContent(path: string | null, showContent: boolean) {
  if (path && showContent) {
    const Component = use(getComponent(path));
    return <Component />;
  }
}

export const BlogPostListItem = iso(`
  field BfBlogPost.BlogPostListItem @component {
    __typename
    title
    author
    cta
    summary
    href
  }
`)(function BlogPostListItem({ data }, { showContent }) {
  logger.setLevel(logger.levels.DEBUG);
  const contentElement = useContent(data.href, showContent);
  logger.debug(contentElement, data, showContent);
  logger.resetLevel();
  return (
    <>
      <a
        href={data?.href ?? "/"}
        className="blog-page-list-item"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="blog-page-item-info">
          <h3>{data.title}</h3>
          <p>{data.summary}</p>
          <p>By {data.author}</p>
          {contentElement}
          <p>{data.cta}</p>
        </div>
      </a>
    </>
  );
});
