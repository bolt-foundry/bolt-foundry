import { BuildSchemaOptions, DocumentNode, GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { GraphQLParseOptions } from './Interfaces.d.ts';
export interface Source {
    document?: DocumentNode;
    schema?: GraphQLSchema;
    rawSDL?: string;
    location?: string;
}
export type BaseLoaderOptions = GraphQLParseOptions & BuildSchemaOptions & {
    cwd?: string;
    ignore?: string | string[];
    includeSources?: boolean;
};
export type WithList<T> = T | T[];
export type ElementOf<TList> = TList extends Array<infer TElement> ? TElement : never;
export interface Loader<TOptions extends BaseLoaderOptions = BaseLoaderOptions> {
    load(pointer: string, options?: TOptions): Promise<Source[] | null | never>;
    loadSync?(pointer: string, options?: TOptions): Source[] | null | never;
}
