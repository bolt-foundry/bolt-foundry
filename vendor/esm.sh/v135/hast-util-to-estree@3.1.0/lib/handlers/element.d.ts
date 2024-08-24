/**
 * Turn a hast element into an estree node.
 *
 * @param {HastElement} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {JsxElement}
 *   estree expression.
 */
export function element(node: HastElement, state: State): JsxElement;
export type Property = import('https://esm.sh/v135/@types/estree@1.0.5/index.d.ts').Property;
export type JsxAttribute = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXAttribute;
export type JsxElement = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXElement;
export type JsxSpreadAttribute = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXSpreadAttribute;
export type HastElement = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type State = import('../state.d.ts').State;
export type Style = Record<string, string>;
