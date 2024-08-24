/**
 * Turn an mdast `inlineCode` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {InlineCode} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function inlineCode(state: State, node: InlineCode): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Text = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Text;
export type InlineCode = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').InlineCode;
export type State = import('../state.d.ts').State;
