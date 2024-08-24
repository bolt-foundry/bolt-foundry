import { GraphQLInputType, GraphQLList, GraphQLNamedType, GraphQLNonNull, GraphQLType } from 'graphql';
import type { DynamicInputMethodDef, DynamicOutputMethodDef } from '../dynamicMethod';
import type { DynamicOutputPropertyDef } from '../dynamicProperty';
import type { NexusPlugin } from '../plugin';
import type { AllInputTypes, GetGen } from '../typegenTypeHelpers';
import { PrintedGenTyping, PrintedGenTypingImport } from '../utils';
import { NexusArgDef } from './args';
import type { NexusEnumTypeDef } from './enumType';
import type { NexusExtendInputTypeDef } from './extendInputType';
import type { NexusExtendTypeDef } from './extendType';
import type { NexusInputObjectTypeDef } from './inputObjectType';
import type { NexusInterfaceTypeDef } from './interfaceType';
import { NexusListDef } from './list';
import { NexusNonNullDef } from './nonNull';
import { NexusNullDef } from './nullable';
import type { NexusObjectTypeDef } from './objectType';
import type { NexusScalarTypeDef } from './scalarType';
import { NexusMetaType } from './nexusMeta';
import type { NexusUnionTypeDef } from './unionType';
import { NexusTypes, NexusWrappedSymbol } from './_types';
/** Input(named): Nexus only */
export declare type AllNexusNamedInputTypeDefs<T extends string = any> = NexusInputObjectTypeDef<T> | NexusEnumTypeDef<T> | NexusScalarTypeDef<T>;
/** Input(named): Nexus + GraphQLInput */
export declare type AllNamedInputTypeDefs<T extends string = any> = AllNexusNamedInputTypeDefs<T> | Exclude<GraphQLInputType, GraphQLList<any> | GraphQLNonNull<any>>;
/** Input(all): Nexus + GraphQL */
export declare type AllNexusInputTypeDefs<T extends string = any> = AllNamedInputTypeDefs<T> | NexusListDef<any> | NexusNonNullDef<any> | NexusNullDef<any> | GraphQLList<any> | GraphQLNonNull<any>;
/** Output(named): Nexus only */
export declare type AllNexusNamedOutputTypeDefs = NexusObjectTypeDef<any> | NexusInterfaceTypeDef<any> | NexusUnionTypeDef<any> | NexusEnumTypeDef<any> | NexusScalarTypeDef<any>;
/** Output(all): Nexus only */
export declare type AllNexusOutputTypeDefs = AllNexusNamedOutputTypeDefs | NexusListDef<any> | NexusNonNullDef<any> | NexusNullDef<any>;
/** Input + output(named): Nexus only */
export declare type AllNexusNamedTypeDefs = AllNexusNamedInputTypeDefs | AllNexusNamedOutputTypeDefs;
/** Input + output(all): Nexus only */
export declare type AllNexusTypeDefs = AllNexusOutputTypeDefs | AllNexusInputTypeDefs;
/** Input + output(all): Nexus only + Name */
export declare type AllNamedTypeDefs = AllNexusNamedTypeDefs | GraphQLNamedType;
/** All inputs to list(...) */
export declare type NexusListableTypes = GetGen<'allNamedTypes', string> | AllNamedTypeDefs | NexusArgDef<any> | NexusListDef<NexusListableTypes> | NexusNonNullDef<NexusNonNullableTypes> | NexusNullDef<NexusNullableTypes> | GraphQLType | NexusMetaType;
/** All inputs to nonNull(...) */
export declare type NexusNonNullableTypes = GetGen<'allNamedTypes', string> | AllNamedTypeDefs | NexusListDef<NexusListableTypes> | NexusArgDef<any> | NexusMetaType;
/** All inputs to nullable(...) */
export declare type NexusNullableTypes = GetGen<'allNamedTypes', string> | AllNamedTypeDefs | NexusListDef<NexusListableTypes> | NexusArgDef<any> | NexusMetaType;
export declare type AllNexusNamedArgsDefs<T extends AllInputTypes = AllInputTypes> = T | NexusArgDef<T> | AllNamedInputTypeDefs<T> | GraphQLInputType;
export declare type AllNexusArgsDefs = AllNexusNamedArgsDefs | NexusListDef<any> | NexusNonNullDef<any> | NexusNullDef<any> | GraphQLInputType;
export declare const isNexusTypeDef: (obj: any) => obj is {
    [NexusWrappedSymbol]: NexusTypes;
};
export declare function isNexusStruct(obj: any): obj is {
    [NexusWrappedSymbol]: NexusTypes;
};
export declare function isNexusNamedTypeDef(obj: any): obj is AllNexusNamedTypeDefs;
export declare function isNexusListTypeDef(obj: any): obj is NexusListDef<any>;
export declare function isNexusNonNullTypeDef(obj: any): obj is NexusNonNullDef<any>;
export declare function isNexusNullTypeDef(obj: any): obj is NexusNullDef<any>;
export declare function isNexusWrappingType(obj: any): obj is NexusListDef<any> | NexusNullDef<any> | NexusNonNullDef<any>;
export declare function isNexusExtendInputTypeDef(obj: any): obj is NexusExtendInputTypeDef<string>;
export declare function isNexusExtendTypeDef(obj: any): obj is NexusExtendTypeDef<string>;
export declare function isNexusEnumTypeDef(obj: any): obj is NexusEnumTypeDef<string>;
export declare function isNexusInputObjectTypeDef(obj: any): obj is NexusInputObjectTypeDef<string>;
export declare function isNexusObjectTypeDef(obj: any): obj is NexusObjectTypeDef<string>;
export declare function isNexusScalarTypeDef(obj: any): obj is NexusScalarTypeDef<string>;
export declare function isNexusUnionTypeDef(obj: any): obj is NexusUnionTypeDef<string>;
export declare function isNexusInterfaceTypeDef(obj: any): obj is NexusInterfaceTypeDef<string>;
export declare function isNexusArgDef(obj: any): obj is NexusArgDef<AllInputTypes>;
export declare function isNexusNamedOuputTypeDef(obj: any): obj is AllNexusNamedOutputTypeDefs;
export declare function isNexusNamedInputTypeDef(obj: any): obj is AllNexusNamedInputTypeDefs;
export declare function isNexusDynamicOutputProperty<T extends string>(obj: any): obj is DynamicOutputPropertyDef<T>;
export declare function isNexusDynamicOutputMethod<T extends string>(obj: any): obj is DynamicOutputMethodDef<T>;
export declare function isNexusDynamicInputMethod<T extends string>(obj: any): obj is DynamicInputMethodDef<T>;
export declare function isNexusPrintedGenTyping(obj: any): obj is PrintedGenTyping;
export declare function isNexusPrintedGenTypingImport(obj: any): obj is PrintedGenTypingImport;
export declare function isNexusPlugin(obj: any): obj is NexusPlugin;
export declare type NexusWrapKind = 'NonNull' | 'Null' | 'List';
export declare type NexusFinalWrapKind = 'NonNull' | 'List';
export declare function unwrapGraphQLDef(typeDef: GraphQLType): {
    namedType: GraphQLNamedType;
    wrapping: NexusFinalWrapKind[];
};
/** Unwraps any wrapped Nexus or GraphQL types, turning into a list of wrapping */
export declare function unwrapNexusDef(typeDef: AllNexusTypeDefs | AllNexusArgsDefs | GraphQLType | NexusMetaType | string): {
    namedType: AllNexusNamedTypeDefs | AllNexusArgsDefs | GraphQLNamedType | string;
    wrapping: NexusWrapKind[];
};
/** Takes the named type, and applies any of the NexusFinalWrapKind to create a properly wrapped GraphQL type. */
export declare function rewrapAsGraphQLType(baseType: GraphQLNamedType, wrapping: NexusFinalWrapKind[]): GraphQLType;
/**
 * Apply the wrapping consistently to the arg `type`
 *
 * NonNull(list(stringArg())) -> arg({ type: nonNull(list('String')) })
 */
export declare function normalizeArgWrapping(argVal: AllNexusArgsDefs): NexusArgDef<AllInputTypes>;
/**
 * Applies the ['List', 'NonNull', 'Nullable']
 *
 * @param toWrap
 * @param wrapping
 */
export declare function applyNexusWrapping(toWrap: any, wrapping: NexusWrapKind[]): any;
/**
 * Takes the "nonNullDefault" value, the chained wrapping, and the field wrapping, to determine the proper
 * list of wrapping to apply to the field
 */
export declare function finalizeWrapping(nonNullDefault: boolean, typeWrapping: NexusWrapKind[] | ReadonlyArray<NexusWrapKind>, chainWrapping?: NexusWrapKind[]): NexusFinalWrapKind[];
