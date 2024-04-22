import { DocumentNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { DirectiveUsage } from './types.d.ts';
export type TypeAndFieldToDirectives = {
    [typeAndField: string]: DirectiveUsage[];
};
interface Options {
    includeInputTypes?: boolean;
}
export declare function getFieldsWithDirectives(documentNode: DocumentNode, options?: Options): TypeAndFieldToDirectives;
export {};
