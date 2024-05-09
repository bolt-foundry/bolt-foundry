export type {
  CompileContext,
  Encoding,
  Extension,
  Handle,
  OnEnterError,
  OnExitError,
  Options,
  Token,
  Transform,
  Value
} from './lib/index.d.ts'

export {fromMarkdown} from './lib/index.d.ts'

/**
 * Interface of tracked data.
 *
 * When working on extensions that use more data, extend the corresponding
 * interface to register their types:
 *
 * ```ts
 * declare module 'mdast-util-from-markdown' {
 *   interface CompileData {
 *     // Register a new field.
 *     mathFlowInside?: boolean | undefined
 *   }
 * }
 * ```
 */
export interface CompileData {
  /**
   * Whether we’re inside a hard break.
   */
  atHardBreak?: boolean | undefined

  /**
   * Current character reference type.
   */
  characterReferenceType?:
    | 'characterReferenceMarkerHexadecimal'
    | 'characterReferenceMarkerNumeric'
    | undefined

  /**
   * Whether a first list item value (`1` in `1. a`) is expected.
   */
  expectingFirstListItemValue?: boolean | undefined

  /**
   * Whether we’re in flow code.
   */
  flowCodeInside?: boolean | undefined

  /**
   * Whether we’re in a reference.
   */
  inReference?: boolean | undefined

  /**
   * Whether we’re expecting a line ending from a setext heading, which can be slurped.
   */
  setextHeadingSlurpLineEnding?: boolean | undefined

  /**
   * Current reference.
   */
  referenceType?: 'collapsed' | 'full' | undefined
}

declare module 'https://esm.sh/v135/micromark-util-types@2.0.0/index.d.ts' {
  interface TokenTypeMap {
    listItem: 'listItem'
  }

  interface Token {
    _spread?: boolean
  }
}
