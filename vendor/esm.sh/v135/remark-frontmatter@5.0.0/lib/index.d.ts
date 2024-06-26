/**
 * Add support for frontmatter.
 *
 * ###### Notes
 *
 * Doesn’t parse the data inside them: create your own plugin to do that.
 *
 * @param {Options | null | undefined} [options='yaml']
 *   Configuration (default: `'yaml'`).
 * @returns {undefined}
 *   Nothing.
 */
export default function remarkFrontmatter(options?: Options | null | undefined): undefined;
export type Root = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Root;
export type Options = import('https://esm.sh/v135/micromark-extension-frontmatter@2.0.0/index.d.ts').Options;
export type Processor = import('https://esm.sh/v135/unified@11.0.4/index.d.ts').Processor<Root>;
