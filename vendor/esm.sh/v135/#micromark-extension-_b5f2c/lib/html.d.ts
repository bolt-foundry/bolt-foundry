/**
 * Create an extension for `micromark` to support frontmatter when serializing
 * to HTML.
 *
 * > 👉 **Note**: this makes sure nothing is generated in the output HTML for
 * > frontmatter.
 *
 * @param {Options | null | undefined} [options='yaml']
 *   Configuration (default: `'yaml'`).
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions`, to
 *   support frontmatter when serializing to HTML.
 */
export function frontmatterHtml(
  options?: Options | null | undefined
): HtmlExtension
export type CompileContext = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').CompileContext
export type Handle = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Handle
export type HtmlExtension = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').HtmlExtension
export type TokenType = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').TokenType
export type Options = import('./to-matters.d.ts').Options
