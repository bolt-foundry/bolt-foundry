/**
 * @typedef {import('micromark-factory-mdx-expression').Acorn} Acorn
 * @typedef {import('micromark-factory-mdx-expression').AcornOptions} AcornOptions
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {AcornOptions | undefined} acornOptions
 *   Acorn options.
 * @property {boolean | undefined} addResult
 *   Whether to add `estree` fields to tokens with results from acorn.
 */

import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { factorySpace } from 'micromark-factory-space';
import { factoryTag } from './factory-tag.js';

/**
 * Parse JSX (flow).
 *
 * @param {Acorn | undefined} acorn
 *   Acorn parser to use (optional).
 * @param {Options} options
 *   Configuration.
 * @returns {Construct}
 *   Construct.
 */
export function jsxFlow(acorn, options) {
  return {
    name: 'mdxJsxFlowTag',
    tokenize: tokenizeJsxFlow,
    concrete: true
  };

  /**
   * MDX JSX (flow).
   *
   * ```markdown
   * > | <A />
   *     ^^^^^
   * ```
   *
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeJsxFlow(effects, ok, nok) {
    const self = this;
    return start;

    /**
     * Start of MDX: JSX (flow).
     *
     * ```markdown
     * > | <A />
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      // To do: in `markdown-rs`, constructs need to parse the indent themselves.
      // This should also be introduced in `micromark-js`.

      return before(code);
    }

    /**
     * After optional whitespace, before of MDX JSX (flow).
     *
     * ```markdown
     * > | <A />
     *     ^
     * ```
     *
     * @type {State}
     */
    function before(code) {
      return factoryTag.call(self, effects, after, nok, acorn, options.acornOptions, options.addResult, false, 'mdxJsxFlowTag', 'mdxJsxFlowTagMarker', 'mdxJsxFlowTagClosingMarker', 'mdxJsxFlowTagSelfClosingMarker', 'mdxJsxFlowTagName', 'mdxJsxFlowTagNamePrimary', 'mdxJsxFlowTagNameMemberMarker', 'mdxJsxFlowTagNameMember', 'mdxJsxFlowTagNamePrefixMarker', 'mdxJsxFlowTagNameLocal', 'mdxJsxFlowTagExpressionAttribute', 'mdxJsxFlowTagExpressionAttributeMarker', 'mdxJsxFlowTagExpressionAttributeValue', 'mdxJsxFlowTagAttribute', 'mdxJsxFlowTagAttributeName', 'mdxJsxFlowTagAttributeNamePrimary', 'mdxJsxFlowTagAttributeNamePrefixMarker', 'mdxJsxFlowTagAttributeNameLocal', 'mdxJsxFlowTagAttributeInitializerMarker', 'mdxJsxFlowTagAttributeValueLiteral', 'mdxJsxFlowTagAttributeValueLiteralMarker', 'mdxJsxFlowTagAttributeValueLiteralValue', 'mdxJsxFlowTagAttributeValueExpression', 'mdxJsxFlowTagAttributeValueExpressionMarker', 'mdxJsxFlowTagAttributeValueExpressionValue')(code);
    }

    /**
     * After an MDX JSX (flow) tag.
     *
     * ```markdown
     * > | <A>
     *        ^
     * ```
     *
     * @type {State}
     */
    function after(code) {
      return markdownSpace(code) ? factorySpace(effects, end, "whitespace")(code) : end(code);
    }

    /**
     * After an MDX JSX (flow) tag, after optional whitespace.
     *
     * ```markdown
     * > | <A> <B>
     *         ^
     * ```
     *
     * @type {State}
     */
    function end(code) {
      // We want to allow expressions directly after tags.
      // See <https://github.com/micromark/micromark-extension-mdx-expression/blob/d5d92b9/packages/micromark-extension-mdx-expression/dev/lib/syntax.js#L183>
      // for more info.
      const leftBraceValue = self.parser.constructs.flow[123];
      /* c8 ignore next 5 -- always a list when normalized. */
      const constructs = Array.isArray(leftBraceValue) ? leftBraceValue : leftBraceValue ? [leftBraceValue] : [];
      const expression = constructs.find(d => d.name === 'mdxFlowExpression');

      // Another tag.
      return code === 60 ?
      // We can’t just say: fine. Lines of blocks have to be parsed until an eol/eof.
      start(code) : code === 123 && expression ? effects.attempt(expression, end, nok)(code) : code === null || markdownLineEnding(code) ? ok(code) : nok(code);
    }
  }
}