/**
 * Turn an mdast `thematicBreak` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {ThematicBreak} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function thematicBreak(state: State, node: ThematicBreak): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type ThematicBreak = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ThematicBreak;
export type State = import('../state.d.ts').State;
