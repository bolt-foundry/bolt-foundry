import type { ExecutionResult } from 'graphql';
import { type DocumentNode, type GraphQLSchema } from 'graphql';
import type { SomeExecutionResultWithoutErrors } from '../../lib/graphql.js';
import { type Variables } from '../../lib/graphql.js';
import type { Object$2 } from '../1_Schema/__.js';
import { Schema } from '../1_Schema/__.js';
import type { GlobalRegistry } from '../2_generator/globalRegistry.js';
import type { GraphQLObjectSelection } from '../3_SelectionSet/encode.js';
import type { ApplyInputDefaults, Config, ReturnModeTypeBase, ReturnModeTypeSuccessData } from './Config.js';
import type { DocumentFn } from './document.js';
import type { GetRootTypeMethods } from './RootTypeMethods.js';
export type Client<$Index extends Schema.Index, $Config extends Config> = {
    raw: (document: string | DocumentNode, variables?: Variables, operationName?: string) => Promise<ExecutionResult>;
    rawOrThrow: (document: string | DocumentNode, variables?: Variables, operationName?: string) => Promise<SomeExecutionResultWithoutErrors>;
    document: DocumentFn<$Config, $Index>;
} & GetRootTypeMethods<$Config, $Index>;
export interface HookInputDocumentEncode {
    rootIndex: Object$2;
    documentObject: GraphQLObjectSelection;
}
export type InputPrefilled<$Schema extends GlobalRegistry.SchemaList> = $Schema extends any ? {
    schema: URL | string | GraphQLSchema;
    headers?: HeadersInit;
    returnMode?: ReturnModeTypeBase | (GlobalRegistry.HasSchemaErrors<$Schema> extends true ? ReturnModeTypeSuccessData : never);
    hooks?: {
        documentEncode: (input: HookInputDocumentEncode, fn: (input: HookInputDocumentEncode) => GraphQLObjectSelection) => GraphQLObjectSelection;
    };
} : never;
export type Input<$Schema extends GlobalRegistry.SchemaList> = {
    /**
     * @defaultValue 'default'
     */
    name?: $Schema['index']['name'];
    /**
     * Used internally for several functions.
     *
     * When custom scalars are being used, this runtime schema is used to
     * encode/decode them before/after your application sends/receives them.
     *
     * When using root type field methods, this runtime schema is used to assist how arguments on scalars versus objects
     * are constructed into the sent GraphQL document.
     */
    schemaIndex: Schema.Index;
} & InputPrefilled<$Schema>;
export type CreatePrefilled = <$Name extends GlobalRegistry.SchemaNames>(name: $Name, schemaIndex: Schema.Index) => <$Input extends InputPrefilled<GlobalRegistry.Schemas[$Name]>>(input: $Input) => Client<GlobalRegistry.GetSchemaIndexOrDefault<$Name>, ApplyInputDefaults<{
    returnMode: $Input['returnMode'];
}>>;
export declare const createPrefilled: CreatePrefilled;
type Create = <$Input extends Input<GlobalRegistry.SchemaList>>(input: $Input) => Client<GlobalRegistry.GetSchemaIndexOrDefault<$Input['name']>, ApplyInputDefaults<{
    returnMode: $Input['returnMode'];
}>>;
export declare const create: Create;
export {};
//# sourceMappingURL=client.d.ts.map