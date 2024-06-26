/**
 * Turn a hast comment into an estree node.
 *
 * @param {HastComment} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {JsxExpressionContainer}
 *   estree expression.
 */
export function comment(node: HastComment, state: State): JsxExpressionContainer;
export type Comment = import('https://esm.sh/v135/@types/estree@1.0.5/index.d.ts').Comment;
export type JsxEmptyExpression = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXEmptyExpression;
export type JsxExpressionContainer = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXExpressionContainer;
export type HastComment = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Comment;
export type State = import('../state.d.ts').State;
