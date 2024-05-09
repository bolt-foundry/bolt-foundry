/**
 * Turn an MDX expression node into an estree node.
 *
 * @param {MdxFlowExpression | MdxTextExpression} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {JsxExpressionContainer}
 *   estree expression.
 */
export function mdxExpression(node: MdxFlowExpression | MdxTextExpression, state: State): JsxExpressionContainer;
export type Expression = import('https://esm.sh/v135/@types/estree@1.0.5/index.d.ts').Expression;
export type JsxEmptyExpression = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXEmptyExpression;
export type JsxExpressionContainer = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXExpressionContainer;
export type MdxFlowExpression = import('https://esm.sh/v135/mdast-util-mdx-expression@2.0.0/index.d.ts').MdxFlowExpressionHast;
export type MdxTextExpression = import('https://esm.sh/v135/mdast-util-mdx-expression@2.0.0/index.d.ts').MdxTextExpressionHast;
export type State = import('../state.d.ts').State;
