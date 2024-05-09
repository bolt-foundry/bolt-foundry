/**
 * Turn an mdast `root` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {MdastRoot} node
 *   mdast node.
 * @returns {HastParents}
 *   hast node.
 */
export function root(state: State, node: MdastRoot): HastParents;
export type HastParents = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Parents;
export type HastRoot = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Root;
export type MdastRoot = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Root;
export type State = import('../state.d.ts').State;
