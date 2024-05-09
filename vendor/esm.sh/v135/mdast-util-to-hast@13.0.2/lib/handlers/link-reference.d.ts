/**
 * Turn an mdast `linkReference` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {LinkReference} node
 *   mdast node.
 * @returns {Array<ElementContent> | ElementContent}
 *   hast node.
 */
export function linkReference(state: State, node: LinkReference): Array<ElementContent> | ElementContent;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type ElementContent = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').ElementContent;
export type Properties = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Properties;
export type LinkReference = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').LinkReference;
export type State = import('../state.d.ts').State;
