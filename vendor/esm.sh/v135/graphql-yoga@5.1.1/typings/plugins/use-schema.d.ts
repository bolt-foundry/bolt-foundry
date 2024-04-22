import { PromiseOrValue } from 'https://esm.sh/v135/@envelop/core@5.0.0/typings/index.d.ts';
import type { GraphQLSchemaWithContext, YogaInitialContext } from '../types.d.ts';
import type { Plugin } from './types.d.ts';
export type YogaSchemaDefinition<TServerContext, TUserContext> = PromiseOrValue<GraphQLSchemaWithContext<TServerContext & YogaInitialContext & TUserContext>> | ((context: TServerContext & {
    request: YogaInitialContext['request'];
}) => PromiseOrValue<GraphQLSchemaWithContext<TServerContext & YogaInitialContext & TUserContext>>);
export declare const useSchema: <TServerContext = {}, TUserContext = {}>(schemaDef?: YogaSchemaDefinition<TServerContext, TUserContext> | undefined) => Plugin<YogaInitialContext & TServerContext>;
