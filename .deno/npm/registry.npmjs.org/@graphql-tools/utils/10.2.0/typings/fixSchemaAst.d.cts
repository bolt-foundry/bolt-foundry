import { BuildSchemaOptions, GraphQLSchema } from 'graphql';
import { SchemaPrintOptions } from './types.cjs';
export declare function fixSchemaAst(schema: GraphQLSchema, options: BuildSchemaOptions & SchemaPrintOptions): GraphQLSchema;
