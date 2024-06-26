/**
 * @param {Html} node
 * @returns {string}
 */
export function html(node: Html): string;
export namespace html {
    export { htmlPeek as peek };
}
export type Html = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Html;
/**
 * @returns {string}
 */
declare function htmlPeek(): string;
export {};
