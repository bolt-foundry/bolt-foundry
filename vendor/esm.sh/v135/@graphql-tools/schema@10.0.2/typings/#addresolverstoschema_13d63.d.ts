import { GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { IAddResolversToSchemaOptions } from 'https://esm.sh/v135/@graphql-tools/utils@10.0.11/typings/index.d.ts';
export declare function addResolversToSchema({ schema, resolvers: inputResolvers, defaultFieldResolver, resolverValidationOptions, inheritResolversFromInterfaces, updateResolversInPlace, }: IAddResolversToSchemaOptions): GraphQLSchema;
