/**
 * Turn markdown into a syntax tree.
 *
 * @overload
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @overload
 * @param {Value} value
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @param {Value} value
 *   Markdown to parse.
 * @param {Encoding | Options | null | undefined} [encoding]
 *   Character encoding for when `value` is `Buffer`.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {Root}
 *   mdast tree.
 */
export function fromMarkdown(value: Value, encoding?: Encoding | null | undefined, options?: Options | null | undefined): Root;
/**
 * Turn markdown into a syntax tree.
 *
 * @overload
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @overload
 * @param {Value} value
 * @param {Options | null | undefined} [options]
 * @returns {Root}
 *
 * @param {Value} value
 *   Markdown to parse.
 * @param {Encoding | Options | null | undefined} [encoding]
 *   Character encoding for when `value` is `Buffer`.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {Root}
 *   mdast tree.
 */
export function fromMarkdown(value: Value, options?: Options | null | undefined): Root;
export type Break = import('mdast').Break;
export type Blockquote = import('mdast').Blockquote;
export type Code = import('mdast').Code;
export type Definition = import('mdast').Definition;
export type Emphasis = import('mdast').Emphasis;
export type Heading = import('mdast').Heading;
export type Html = import('mdast').Html;
export type Image = import('mdast').Image;
export type InlineCode = import('mdast').InlineCode;
export type Link = import('mdast').Link;
export type List = import('mdast').List;
export type ListItem = import('mdast').ListItem;
export type Nodes = import('mdast').Nodes;
export type Paragraph = import('mdast').Paragraph;
export type Parent = import('mdast').Parent;
export type PhrasingContent = import('mdast').PhrasingContent;
export type ReferenceType = import('mdast').ReferenceType;
export type Root = import('mdast').Root;
export type Strong = import('mdast').Strong;
export type Text = import('mdast').Text;
export type ThematicBreak = import('mdast').ThematicBreak;
export type Encoding = import('micromark-util-types').Encoding;
export type Event = import('micromark-util-types').Event;
export type ParseOptions = import('micromark-util-types').ParseOptions;
export type Token = import('micromark-util-types').Token;
export type TokenizeContext = import('micromark-util-types').TokenizeContext;
export type Value = import('micromark-util-types').Value;
export type Point = import('unist').Point;
export type CompileData = import('../index.js').CompileData;
export type Fragment = Omit<Parent, 'children' | 'type'> & {
    type: 'fragment';
    children: Array<PhrasingContent>;
};
/**
 * Extra transform, to change the AST afterwards.
 */
export type Transform = (tree: Root) => Root | null | undefined | void;
/**
 * Handle a token.
 */
export type Handle = (this: CompileContext, token: Token) => undefined | void;
/**
 * Token types mapping to handles
 */
export type Handles = Record<string, Handle>;
/**
 * Handle the case where the `right` token is open, but it is closed (by the
 * `left` token) or because we reached the end of the document.
 */
export type OnEnterError = (this: Omit<CompileContext, 'sliceSerialize'>, left: Token | undefined, right: Token) => undefined;
/**
 * Handle the case where the `right` token is open but it is closed by
 * exiting the `left` token.
 */
export type OnExitError = (this: Omit<CompileContext, 'sliceSerialize'>, left: Token, right: Token) => undefined;
/**
 * Open token on the stack, with an optional error handler for when
 * that token isn’t closed properly.
 */
export type TokenTuple = [Token, OnEnterError | undefined];
/**
 * Configuration.
 *
 * We have our defaults, but extensions will add more.
 */
export type Config = {
    /**
     *   Token types where line endings are used.
     */
    canContainEols: Array<string>;
    /**
     *   Opening handles.
     */
    enter: Handles;
    /**
     *   Closing handles.
     */
    exit: Handles;
    /**
     *   Tree transforms.
     */
    transforms: Array<Transform>;
};
/**
 * Change how markdown tokens from micromark are turned into mdast.
 */
export type Extension = Partial<Config>;
/**
 * mdast compiler context.
 */
export type CompileContext = {
    /**
     *   Stack of nodes.
     */
    stack: Array<Fragment | Nodes>;
    /**
     *   Stack of tokens.
     */
    tokenStack: Array<TokenTuple>;
    /**
     *   Capture some of the output data.
     */
    buffer: (this: CompileContext) => undefined;
    /**
     *   Stop capturing and access the output data.
     */
    resume: (this: CompileContext) => string;
    /**
     *   Enter a node.
     */
    enter: (this: CompileContext, node: Nodes, token: Token, onError?: OnEnterError) => undefined;
    /**
     *   Exit a node.
     */
    exit: (this: CompileContext, token: Token, onError?: OnExitError) => undefined;
    /**
     *   Get the string value of a token.
     */
    sliceSerialize: TokenizeContext['sliceSerialize'];
    /**
     *   Configuration.
     */
    config: Config;
    /**
     *   Info passed around; key/value store.
     */
    data: CompileData;
};
/**
 * Configuration for how to build mdast.
 */
export type FromMarkdownOptions = {
    /**
     * Extensions for this utility to change how tokens are turned into a tree.
     */
    mdastExtensions?: Array<Extension | Array<Extension>> | null | undefined;
};
/**
 * Configuration.
 */
export type Options = ParseOptions & FromMarkdownOptions;
//# sourceMappingURL=index.d.ts.map