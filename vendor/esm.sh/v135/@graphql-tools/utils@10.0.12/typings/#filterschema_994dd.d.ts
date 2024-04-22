import { GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { ArgumentFilter, FieldFilter, RootFieldFilter, TypeFilter } from './Interfaces.d.ts';
export declare function filterSchema({ schema, typeFilter, fieldFilter, rootFieldFilter, objectFieldFilter, interfaceFieldFilter, inputObjectFieldFilter, argumentFilter, }: {
    schema: GraphQLSchema;
    rootFieldFilter?: RootFieldFilter;
    typeFilter?: TypeFilter;
    fieldFilter?: FieldFilter;
    objectFieldFilter?: FieldFilter;
    interfaceFieldFilter?: FieldFilter;
    inputObjectFieldFilter?: FieldFilter;
    argumentFilter?: ArgumentFilter;
}): GraphQLSchema;
