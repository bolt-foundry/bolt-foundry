/**
 * @param {Image} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function image(node: Image, _: Parents | undefined, state: State, info: Info): string;
export namespace image {
    export { imagePeek as peek };
}
export type Image = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Image;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
/**
 * @returns {string}
 */
declare function imagePeek(): string;
export {};
