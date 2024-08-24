/**
 * Create an extension for `mdast-util-from-markdown` to enable MDX.js ESM in
 * markdown.
 *
 * When using the micromark syntax extension with `addResult`, nodes will have
 * a `data.estree` field set to an ESTree [`Program`][program] node.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown` to enable MDX.js ESM.
 */
export function mdxjsEsmFromMarkdown(): FromMarkdownExtension;
/**
 * Create an extension for `mdast-util-to-markdown` to enable MDX.js ESM in
 * markdown.
 *
 * @returns {ToMarkdownExtension}
 *   Extension for `mdast-util-to-markdown` to enable MDX.js ESM.
 */
export function mdxjsEsmToMarkdown(): ToMarkdownExtension;
export type CompileContext = import('https://esm.sh/v135/mdast-util-from-markdown@2.0.0/index.d.ts').CompileContext;
export type FromMarkdownExtension = import('https://esm.sh/v135/mdast-util-from-markdown@2.0.0/index.d.ts').Extension;
export type FromMarkdownHandle = import('https://esm.sh/v135/mdast-util-from-markdown@2.0.0/index.d.ts').Handle;
export type ToMarkdownHandle = import('https://esm.sh/v135/mdast-util-to-markdown@2.1.0/index.d.ts').Handle;
export type ToMarkdownExtension = import('https://esm.sh/v135/mdast-util-to-markdown@2.1.0/index.d.ts').Options;
export type MdxjsEsm = import('../index.d.ts').MdxjsEsm;
