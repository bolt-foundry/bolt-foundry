import { GraphQLEnumType, GraphQLFieldConfigArgumentMap, GraphQLFieldConfigMap, GraphQLInputFieldConfigMap, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType } from 'graphql';
import type { MergeSchemaConfig } from './builder';
import { ArgsRecord } from './definitions/args';
import type { InputDefinitionBlock } from './definitions/definitionBlocks';
import { InterfaceDefinitionBlock } from './definitions/interfaceType';
import { ObjectDefinitionBlock } from './definitions/objectType';
import type { Maybe, SourceTypingDef } from './definitions/_types';
export interface RebuildConfig extends Omit<MergeSchemaConfig, 'schema'> {
    captureLeafType?: (type: GraphQLNamedType) => void;
    asNexusMethod?: string;
    sourceType?: SourceTypingDef;
}
export declare function rebuildNamedType(type: GraphQLNamedType, config: RebuildConfig): import("./definitions/inputObjectType").NexusInputObjectTypeDef<string> | import("./definitions/enumType").NexusEnumTypeDef<string> | import("./definitions/scalarType").NexusScalarTypeDef<string> | import("./definitions/objectType").NexusObjectTypeDef<string> | import("./definitions/interfaceType").NexusInterfaceTypeDef<string> | import("./definitions/unionType").NexusUnionTypeDef<string>;
export declare function rebuildInputObjectType(type: GraphQLInputObjectType, config: RebuildConfig): import("./definitions/inputObjectType").NexusInputObjectTypeDef<string>;
export declare function rebuildUnionType(type: GraphQLUnionType, config: RebuildConfig): import("./definitions/unionType").NexusUnionTypeDef<string>;
export declare function rebuildScalarType(type: GraphQLScalarType, config: RebuildConfig): import("./definitions/scalarType").NexusScalarTypeDef<string>;
export declare function rebuildEnumType(type: GraphQLEnumType, { sourceType, asNexusMethod }: RebuildConfig): import("./definitions/enumType").NexusEnumTypeDef<string>;
export declare function rebuildInterfaceType(type: GraphQLInterfaceType, config: RebuildConfig): import("./definitions/interfaceType").NexusInterfaceTypeDef<string>;
export declare function rebuildObjectType(type: GraphQLObjectType, config: RebuildConfig): import("./definitions/objectType").NexusObjectTypeDef<string>;
export declare function rebuildOutputDefinition(typeName: string, t: ObjectDefinitionBlock<string> | InterfaceDefinitionBlock<string>, fields: GraphQLFieldConfigMap<any, any>, interfaces: ReadonlyArray<GraphQLInterfaceType>, config: RebuildConfig): void;
export declare function rebuildInputDefinition(typeName: string, t: InputDefinitionBlock<string>, fields: GraphQLInputFieldConfigMap, config: RebuildConfig): void;
export declare function rebuildArgs(typeName: string, fieldName: string, argMap: Maybe<GraphQLFieldConfigArgumentMap>, config: RebuildConfig): Maybe<ArgsRecord>;
