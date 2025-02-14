import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { use, useState } from "react";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

// let promise: Promise<any> | undefined;
// let promiseResolver: any;
// let returnable: any;
// function getImport(path: string) {
//   logger.debug(`Getting import for ${path}`);
//   if (!promise) {
//     promise = new Promise((resolve) => {
//       promiseResolver = resolve;
//     })
//     import('content/documentation/quickstart.mdx').then((module) => {
//       promiseResolver(module.default);
//     });
//   }
//   return promise;
// }

const loadingPromises = new Map<string, Promise<React.FC>>();

function getComponent(
  path: string,
): Promise<React.FC> {
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
`)(function BlogPostListItem({ data }) {
  // const [score, setScore] = useState(0);
  const thingy = useContent(data.href);
  logger.info("rendurr");
  return thingy;
  // return (
  //   <>
  //     <button onClick={() => setScore(score + 1)}>{score}</button>
  //     <a
  //       href={data?.href ?? "/"}
  //       className="blog-page-list-item"
  //       style={{ textDecoration: "none", color: "inherit" }}
  //     >
  //       <div className="blog-page-item-info">
  //         <h3>{data.title}</h3>
  //         <p>{data.summary}</p>
  //         <p>By {data.author}</p>
  //         <p>{data.cta}</p>
  //       </div>
  //     </a>
  //   </>
  // );
});
