/**
 * @param {ImageReference} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function imageReference(node: ImageReference, _: Parents | undefined, state: State, info: Info): string;
export namespace imageReference {
    export { imageReferencePeek as peek };
}
export type ImageReference = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').ImageReference;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
/**
 * @returns {string}
 */
declare function imageReferencePeek(): string;
export {};
