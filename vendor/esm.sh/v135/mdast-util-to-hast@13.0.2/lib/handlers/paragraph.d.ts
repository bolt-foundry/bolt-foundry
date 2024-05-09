/**
 * Turn an mdast `paragraph` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Paragraph} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function paragraph(state: State, node: Paragraph): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Paragraph = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Paragraph;
export type State = import('../state.d.ts').State;
