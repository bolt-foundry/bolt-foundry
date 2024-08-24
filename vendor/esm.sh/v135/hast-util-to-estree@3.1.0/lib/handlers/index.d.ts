export namespace handlers {
    export { comment };
    export { ignore as doctype };
    export { element };
    export { mdxExpression as mdxFlowExpression };
    export { mdxJsxElement as mdxJsxFlowElement };
    export { mdxJsxElement as mdxJsxTextElement };
    export { mdxExpression as mdxTextExpression };
    export { mdxjsEsm };
    export { root };
    export { text };
}
import { comment } from './comment.d.ts';
/**
 * Handle a node that is ignored.
 *
 * @returns {undefined}
 *   Nothing.
 */
declare function ignore(): undefined;
import { element } from './element.d.ts';
import { mdxExpression } from './mdx-expression.d.ts';
import { mdxJsxElement } from './mdx-jsx-element.d.ts';
import { mdxjsEsm } from './mdxjs-esm.d.ts';
import { root } from './root.d.ts';
import { text } from './text.d.ts';
export {};
