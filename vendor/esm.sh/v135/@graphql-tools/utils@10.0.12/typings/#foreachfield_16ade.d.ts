import { GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { IFieldIteratorFn } from './Interfaces.d.ts';
export declare function forEachField(schema: GraphQLSchema, fn: IFieldIteratorFn): void;
