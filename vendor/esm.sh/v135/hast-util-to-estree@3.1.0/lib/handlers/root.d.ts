/**
 * Turn a hast root node into an estree node.
 *
 * @param {HastRoot} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {JsxFragment}
 *   estree JSX fragment.
 */
export function root(node: HastRoot, state: State): JsxFragment;
export type JsxFragment = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXFragment;
export type HastRoot = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Root;
export type State = import('../state.d.ts').State;
export type JsxChild = JsxFragment['children'][number];
