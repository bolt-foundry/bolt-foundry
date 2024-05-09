/**
 * Turn an mdast syntax tree into markdown.
 *
 * @param {Nodes} tree
 *   Tree to serialize.
 * @param {Options} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized markdown representing `tree`.
 */
export function toMarkdown(tree: Nodes, options?: import("./types.d.ts").Options | undefined): string;
export type Nodes = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Nodes;
export type Enter = import('./types.d.ts').Enter;
export type Info = import('./types.d.ts').Info;
export type Join = import('./types.d.ts').Join;
export type FlowParents = import('./types.d.ts').FlowParents;
export type Options = import('./types.d.ts').Options;
export type PhrasingParents = import('./types.d.ts').PhrasingParents;
export type SafeConfig = import('./types.d.ts').SafeConfig;
export type State = import('./types.d.ts').State;
export type TrackFields = import('./types.d.ts').TrackFields;
