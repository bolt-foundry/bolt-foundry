import type { esbuild } from "infra/build/deps.ts";
import { mdxJs } from "infra/build/deps.ts";

const MDX_REGEX = /\.mdx$/;
const MDX_NAMESPACE = "mdx";

const esbuildDenoMdxPlugin: esbuild.Plugin = {
  name: "deno-mdx-plugin",
  // @ts-expect-error #techdebt
  setup(build) {
    const { onResolve, onLoad } = build;
    // @ts-expect-error #techdebt
    onResolve({ filter: MDX_REGEX }, (args) => {
      return {
        path: args.path,
        namespace: MDX_NAMESPACE,
      };
    });
    // @ts-expect-error #techdebt
    onLoad({ filter: /.*/, namespace: MDX_NAMESPACE }, async (args) => {
      const contents = await Deno.readTextFile(args.path);
      const compiled = await mdxJs.compile(contents, {});
      return {
        contents: String(compiled),
        loader: "js",
      };
    });
  },
};

export default esbuildDenoMdxPlugin;
