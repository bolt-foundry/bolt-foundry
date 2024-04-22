import { BuildSchemaOptions, GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { SchemaPrintOptions } from './types.d.ts';
export declare function fixSchemaAst(schema: GraphQLSchema, options: BuildSchemaOptions & SchemaPrintOptions): GraphQLSchema;
