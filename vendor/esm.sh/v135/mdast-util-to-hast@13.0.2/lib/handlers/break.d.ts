/**
 * Turn an mdast `break` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Break} node
 *   mdast node.
 * @returns {Array<Element | Text>}
 *   hast element content.
 */
export function hardBreak(state: State, node: Break): Array<Element | Text>;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Text = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Text;
export type Break = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Break;
export type State = import('../state.d.ts').State;
