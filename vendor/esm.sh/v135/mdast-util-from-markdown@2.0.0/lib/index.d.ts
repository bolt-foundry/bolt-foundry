export function fromMarkdown(
  value: Value,
  encoding?: Encoding | null | undefined,
  options?: Options | null | undefined
): Root
export function fromMarkdown(
  value: Value,
  options?: Options | null | undefined
): Root
export type Break = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Break
export type Blockquote = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Blockquote
export type Code = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Code
export type Definition = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Definition
export type Emphasis = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Emphasis
export type Heading = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Heading
export type Html = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Html
export type Image = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Image
export type InlineCode = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').InlineCode
export type Link = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Link
export type List = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').List
export type ListItem = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ListItem
export type Nodes = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Nodes
export type Paragraph = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Paragraph
export type Parent = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parent
export type PhrasingContent = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').PhrasingContent
export type ReferenceType = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ReferenceType
export type Root = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Root
export type Strong = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Strong
export type Text = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Text
export type ThematicBreak = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ThematicBreak
export type Encoding = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Encoding
export type Event = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Event
export type ParseOptions = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').ParseOptions
export type Token = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Token
export type TokenizeContext = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').TokenizeContext
export type Value = import('https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts').Value
export type Point = import('https://esm.sh/v135/@types/unist@3.0.2/index.d.ts').Point
export type CompileData = import('../index.d.ts').CompileData
export type Fragment = Omit<Parent, 'children' | 'type'> & {
  type: 'fragment'
  children: Array<PhrasingContent>
}
/**
 * Extra transform, to change the AST afterwards.
 */
export type Transform = (tree: Root) => Root | null | undefined | void
/**
 * Handle a token.
 */
export type Handle = (this: CompileContext, token: Token) => undefined | void
/**
 * Token types mapping to handles
 */
export type Handles = Record<string, Handle>
/**
 * Handle the case where the `right` token is open, but it is closed (by the
 * `left` token) or because we reached the end of the document.
 */
export type OnEnterError = (
  this: Omit<CompileContext, 'sliceSerialize'>,
  left: Token | undefined,
  right: Token
) => undefined
/**
 * Handle the case where the `right` token is open but it is closed by
 * exiting the `left` token.
 */
export type OnExitError = (
  this: Omit<CompileContext, 'sliceSerialize'>,
  left: Token,
  right: Token
) => undefined
/**
 * Open token on the stack, with an optional error handler for when
 * that token isn’t closed properly.
 */
export type TokenTuple = [Token, OnEnterError | undefined]
/**
 * Configuration.
 *
 * We have our defaults, but extensions will add more.
 */
export type Config = {
  /**
   *   Token types where line endings are used.
   */
  canContainEols: Array<string>
  /**
   *   Opening handles.
   */
  enter: Handles
  /**
   *   Closing handles.
   */
  exit: Handles
  /**
   *   Tree transforms.
   */
  transforms: Array<Transform>
}
/**
 * Change how markdown tokens from micromark are turned into mdast.
 */
export type Extension = Partial<Config>
/**
 * mdast compiler context.
 */
export type CompileContext = {
  /**
   *   Stack of nodes.
   */
  stack: Array<Fragment | Nodes>
  /**
   *   Stack of tokens.
   */
  tokenStack: Array<TokenTuple>
  /**
   *   Capture some of the output data.
   */
  buffer: (this: CompileContext) => undefined
  /**
   *   Stop capturing and access the output data.
   */
  resume: (this: CompileContext) => string
  /**
   *   Enter a node.
   */
  enter: (
    this: CompileContext,
    node: Nodes,
    token: Token,
    onError?: OnEnterError
  ) => undefined
  /**
   *   Exit a node.
   */
  exit: (this: CompileContext, token: Token, onError?: OnExitError) => undefined
  /**
   *   Get the string value of a token.
   */
  sliceSerialize: TokenizeContext['sliceSerialize']
  /**
   *   Configuration.
   */
  config: Config
  /**
   *   Info passed around; key/value store.
   */
  data: CompileData
}
/**
 * Configuration for how to build mdast.
 */
export type FromMarkdownOptions = {
  /**
   * Extensions for this utility to change how tokens are turned into a tree.
   */
  mdastExtensions?: Array<Extension | Array<Extension>> | null | undefined
}
/**
 * Configuration.
 */
export type Options = ParseOptions & FromMarkdownOptions
