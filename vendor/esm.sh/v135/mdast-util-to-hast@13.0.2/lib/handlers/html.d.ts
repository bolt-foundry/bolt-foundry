/**
 * Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
 * nothing).
 *
 * @param {State} state
 *   Info passed around.
 * @param {Html} node
 *   mdast node.
 * @returns {Element | Raw | undefined}
 *   hast node.
 */
export function html(state: State, node: Html): Element | Raw | undefined;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Html = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Html;
export type State = import('../state.d.ts').State;
export type Raw = import('../../index.d.ts').Raw;
