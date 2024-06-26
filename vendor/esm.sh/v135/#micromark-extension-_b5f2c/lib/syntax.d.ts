/**
 * Create an extension for `micromark` to enable frontmatter syntax.
 *
 * @param {Options | null | undefined} [options='yaml']
 *   Configuration (default: `'yaml'`).
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to
 *   enable frontmatter syntax.
 */
export function frontmatter(options?: Options | null | undefined): Extension
export type Construct = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Construct
export type ConstructRecord = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').ConstructRecord
export type Extension = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Extension
export type State = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').State
export type TokenType = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').TokenType
export type TokenizeContext = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').TokenizeContext
export type Tokenizer = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Tokenizer
export type Info = import('./to-matters.d.ts').Info
export type Matter = import('./to-matters.d.ts').Matter
export type Options = import('./to-matters.d.ts').Options
