/**
 * Turn an mdast `footnoteReference` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {FootnoteReference} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function footnoteReference(state: State, node: FootnoteReference): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type FootnoteReference = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').FootnoteReference;
export type State = import('../state.d.ts').State;
