/**
 * Turn an MDX JSX element node into an estree node.
 *
 * @param {MdxJsxFlowElement | MdxJsxTextElement} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {JsxElement | JsxFragment}
 *   JSX element or fragment.
 */
export function mdxJsxElement(node: MdxJsxFlowElement | MdxJsxTextElement, state: State): JsxElement | JsxFragment;
export type Expression = import('https://esm.sh/v135/@types/estree@1.0.5/index.d.ts').Expression;
export type JsxAttribute = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXAttribute;
export type JsxElement = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXElement;
export type JsxFragment = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXFragment;
export type JsxSpreadAttribute = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXSpreadAttribute;
export type MdxJsxFlowElement = import('https://esm.sh/v135/mdast-util-mdx-jsx@3.0.0/index.d.ts').MdxJsxFlowElementHast;
export type MdxJsxTextElement = import('https://esm.sh/v135/mdast-util-mdx-jsx@3.0.0/index.d.ts').MdxJsxTextElementHast;
export type State = import('../state.d.ts').State;
