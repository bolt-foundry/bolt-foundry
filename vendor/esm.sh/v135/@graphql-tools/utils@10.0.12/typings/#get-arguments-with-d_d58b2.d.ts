import { DocumentNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { DirectiveUsage } from './types.d.ts';
export type ArgumentToDirectives = {
    [argumentName: string]: DirectiveUsage[];
};
export type TypeAndFieldToArgumentDirectives = {
    [typeAndField: string]: ArgumentToDirectives;
};
export declare function getArgumentsWithDirectives(documentNode: DocumentNode): TypeAndFieldToArgumentDirectives;
