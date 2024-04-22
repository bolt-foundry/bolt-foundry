import { GraphQLEnumType, GraphQLFieldConfigArgumentMap, GraphQLFieldConfigMap, GraphQLInputFieldConfigMap, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import type { MergeSchemaConfig } from './builder.d.ts';
import { ArgsRecord } from './definitions/args.d.ts';
import type { InputDefinitionBlock } from './definitions/definitionBlocks.d.ts';
import { InterfaceDefinitionBlock } from './definitions/interfaceType.d.ts';
import { ObjectDefinitionBlock } from './definitions/objectType.d.ts';
import type { Maybe, SourceTypingDef } from './definitions/_types.d.ts';
export interface RebuildConfig extends Omit<MergeSchemaConfig, 'schema'> {
    captureLeafType?: (type: GraphQLNamedType) => void;
    asNexusMethod?: string;
    sourceType?: SourceTypingDef;
}
export declare function rebuildNamedType(type: GraphQLNamedType, config: RebuildConfig): import("./definitions/inputObjectType.d.ts").NexusInputObjectTypeDef<string> | import("./definitions/enumType.d.ts").NexusEnumTypeDef<string> | import("./definitions/scalarType.d.ts").NexusScalarTypeDef<string> | import("./definitions/objectType.d.ts").NexusObjectTypeDef<string> | import("./definitions/interfaceType.d.ts").NexusInterfaceTypeDef<string> | import("./definitions/unionType.d.ts").NexusUnionTypeDef<string>;
export declare function rebuildInputObjectType(type: GraphQLInputObjectType, config: RebuildConfig): import("./definitions/inputObjectType.d.ts").NexusInputObjectTypeDef<string>;
export declare function rebuildUnionType(type: GraphQLUnionType, config: RebuildConfig): import("./definitions/unionType.d.ts").NexusUnionTypeDef<string>;
export declare function rebuildScalarType(type: GraphQLScalarType, config: RebuildConfig): import("./definitions/scalarType.d.ts").NexusScalarTypeDef<string>;
export declare function rebuildEnumType(type: GraphQLEnumType, { sourceType, asNexusMethod }: RebuildConfig): import("./definitions/enumType.d.ts").NexusEnumTypeDef<string>;
export declare function rebuildInterfaceType(type: GraphQLInterfaceType, config: RebuildConfig): import("./definitions/interfaceType.d.ts").NexusInterfaceTypeDef<string>;
export declare function rebuildObjectType(type: GraphQLObjectType, config: RebuildConfig): import("./definitions/objectType.d.ts").NexusObjectTypeDef<string>;
export declare function rebuildOutputDefinition(typeName: string, t: ObjectDefinitionBlock<string> | InterfaceDefinitionBlock<string>, fields: GraphQLFieldConfigMap<any, any>, interfaces: ReadonlyArray<GraphQLInterfaceType>, config: RebuildConfig): void;
export declare function rebuildInputDefinition(typeName: string, t: InputDefinitionBlock<string>, fields: GraphQLInputFieldConfigMap, config: RebuildConfig): void;
export declare function rebuildArgs(typeName: string, fieldName: string, argMap: Maybe<GraphQLFieldConfigArgumentMap>, config: RebuildConfig): Maybe<ArgsRecord>;
