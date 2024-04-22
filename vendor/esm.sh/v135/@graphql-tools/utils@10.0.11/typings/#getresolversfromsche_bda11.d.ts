import { GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { IResolvers } from './Interfaces.d.ts';
export declare function getResolversFromSchema(schema: GraphQLSchema, includeDefaultMergedResolver?: boolean): IResolvers;
