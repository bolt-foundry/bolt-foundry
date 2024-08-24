/**
 * Handle an MDX ESM node.
 *
 * @param {MdxjsEsm} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {undefined}
 *   Nothing.
 */
export function mdxjsEsm(node: MdxjsEsm, state: State): undefined;
export type MdxjsEsm = import('https://esm.sh/v135/mdast-util-mdxjs-esm@2.0.1/index.d.ts').MdxjsEsmHast;
export type State = import('../state.d.ts').State;
