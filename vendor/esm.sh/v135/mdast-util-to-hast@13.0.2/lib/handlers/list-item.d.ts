/**
 * Turn an mdast `listItem` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {ListItem} node
 *   mdast node.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Element}
 *   hast node.
 */
export function listItem(state: State, node: ListItem, parent: Parents | undefined): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type ElementContent = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').ElementContent;
export type Properties = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Properties;
export type ListItem = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ListItem;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type State = import('../state.d.ts').State;
