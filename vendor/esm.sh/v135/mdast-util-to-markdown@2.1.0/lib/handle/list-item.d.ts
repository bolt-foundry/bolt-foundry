/**
 * @param {ListItem} node
 * @param {Parents | undefined} parent
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function listItem(node: ListItem, parent: Parents | undefined, state: State, info: Info): string;
export type ListItem = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ListItem;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type Map = import('../types.d.ts').Map;
export type State = import('../types.d.ts').State;
