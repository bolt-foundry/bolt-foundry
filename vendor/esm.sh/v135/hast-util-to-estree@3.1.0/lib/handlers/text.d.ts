/**
 * Turn a hast text node into an estree node.
 *
 * @param {HastText} node
 *   hast node to transform.
 * @param {State} state
 *   Info passed around about the current state.
 * @returns {JsxExpressionContainer | undefined}
 *   JSX expression.
 */
export function text(node: HastText, state: State): JsxExpressionContainer | undefined;
export type Literal = import('https://esm.sh/v135/@types/estree@1.0.5/index.d.ts').Literal;
export type JsxExpressionContainer = import('https://esm.sh/v135/@types/estree-jsx@1.0.3/index.d.ts').JSXExpressionContainer;
export type HastText = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Text;
export type State = import('../state.d.ts').State;
