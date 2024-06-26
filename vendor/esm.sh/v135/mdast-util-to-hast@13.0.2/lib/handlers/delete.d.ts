/**
 * Turn an mdast `delete` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Delete} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function strikethrough(state: State, node: Delete): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Delete = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Delete;
export type State = import('../state.d.ts').State;
