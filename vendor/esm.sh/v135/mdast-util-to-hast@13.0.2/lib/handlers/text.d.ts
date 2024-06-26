/**
 * Turn an mdast `text` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastText} node
 *   mdast node.
 * @returns {HastElement | HastText}
 *   hast node.
 */
export function text(state: State, node: MdastText): HastElement | HastText;
export type HastElement = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type HastText = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Text;
export type MdastText = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Text;
export type State = import('../state.d.ts').State;
