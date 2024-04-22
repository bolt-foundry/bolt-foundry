import { IExecutableSchemaDefinition } from 'https://esm.sh/v135/@graphql-tools/schema@10.0.2/typings/index.d.ts';
import { GraphQLSchemaWithContext, YogaInitialContext } from './types.d.ts';
export declare function createSchema<TContext = {}>(opts: IExecutableSchemaDefinition<TContext & YogaInitialContext>): GraphQLSchemaWithContext<TContext & YogaInitialContext>;
