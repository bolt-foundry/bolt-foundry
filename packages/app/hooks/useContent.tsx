import { use } from "react";

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

export function useContent(path: string | null, showContent: boolean) {
  if (path && showContent) {
    const Component = use(getComponent(path));
    return <Component />;
  }
}
