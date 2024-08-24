import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLNamedType, GraphQLObjectType, GraphQLResolveInfo, GraphQLScalarType, GraphQLSchema, GraphQLType, GraphQLUnionType } from 'graphql';
import { NexusMetaType } from './definitions/nexusMeta';
import { AllNexusArgsDefs, AllNexusNamedTypeDefs, AllNexusTypeDefs, AllNamedInputTypeDefs } from './definitions/wrapping';
import { Maybe, MissingType, NexusFeatures, NexusGraphQLSchema, TypingImport } from './definitions/_types';
export declare const isInterfaceField: (type: GraphQLObjectType, fieldName: string) => boolean;
/** Copied from graphql-js: */
/**
 * Given an invalid input string and a list of valid options, returns a filtered list of valid options sorted
 * based on their similarity with the input.
 */
export declare function suggestionList(input?: string, options?: string[]): string[];
export declare function objValues<T>(obj: Record<string, T>): T[];
export declare function mapObj<T, R>(obj: Record<string, T>, mapper: (val: T, key: string, index: number) => R): R[];
export declare function mapValues<T, R>(obj: Record<string, T>, mapper: (val: T, key: string, index: number) => R): Record<string, any>;
export declare function eachObj<T>(obj: Record<string, T>, iter: (val: T, key: string, index: number) => void): void;
export declare const isObject: (obj: any) => boolean;
export declare const assertAbsolutePath: (pathName: string, property: string) => string;
export interface GroupedTypes {
    input: GraphQLInputObjectType[];
    interface: GraphQLInterfaceType[];
    object: GraphQLObjectType[];
    union: GraphQLUnionType[];
    enum: GraphQLEnumType[];
    scalar: Array<GraphQLScalarType & {
        asNexusMethod?: string;
    }>;
}
export declare function groupTypes(schema: GraphQLSchema): GroupedTypes;
export declare function isUnknownType(type: GraphQLNamedType): boolean;
export declare function firstDefined<T>(...args: Array<T | undefined>): T;
export declare function isPromiseLike(value: any): value is PromiseLike<any>;
export declare const typeScriptFileExtension: RegExp;
/**
 * Format a path so it is suitable to be used as a module import.
 *
 * - Implicitly relative is made explicitly relative - TypeScript file extension is stripped - Windows slashes
 * converted into *nix slashes
 *
 * Do not pass Node module IDs here as they will be treated as relative paths e.g. "react" "@types/react" etc.
 */
export declare function formatPathForModuleImport(path: string): string;
export declare function relativePathTo(absolutePath: string, fromPath: string): string;
export interface PrintedGenTypingImportConfig {
    module: string;
    default?: string;
    bindings?: Array<string | [string, string]>;
}
export declare class PrintedGenTypingImport {
    readonly config: PrintedGenTypingImportConfig;
    constructor(config: PrintedGenTypingImportConfig);
}
export declare function printedGenTypingImport(config: PrintedGenTypingImportConfig): PrintedGenTypingImport;
export interface PrintedGenTypingConfig {
    name: string;
    optional: boolean;
    type: string;
    description?: Maybe<string>;
    imports?: PrintedGenTypingImport[];
}
export declare class PrintedGenTyping {
    protected config: PrintedGenTypingConfig;
    constructor(config: PrintedGenTypingConfig);
    get imports(): PrintedGenTypingImport[];
    toString(): string;
}
export declare function printedGenTyping(config: PrintedGenTypingConfig): PrintedGenTyping;
export declare function assertNoMissingTypes(schema: GraphQLSchema, missingTypes: Record<string, MissingType>): void;
export declare function runAbstractTypeRuntimeChecks(schema: NexusGraphQLSchema, features: NexusFeatures): void;
export declare function consoleWarn(msg: string): void;
export declare function log(msg: string): void;
/**
 * Calculate the venn diagram between two iterables based on reference equality checks. The returned tripple
 * contains items thusly:
 *
 *     * items only in arg 1 --> first tripple slot
 *     * items in args 1 & 2 --> second tripple slot
 *     * items only in arg 2 --> third tripple slot
 */
export declare function venn<T>(xs: Iterable<T>, ys: Iterable<T>): [Set<T>, Set<T>, Set<T>];
export declare const UNKNOWN_TYPE_SCALAR: GraphQLScalarType<never, never>;
export declare function pathToArray(infoPath: GraphQLResolveInfo['path']): Array<string | number>;
export declare function getOwnPackage(): {
    name: string;
};
/** Use this to make assertion at end of if-else chain that all members of a union have been accounted for. */
export declare function casesHandled(x: never): never;
/** Quickly log objects */
export declare function dump(x: any): void;
export declare function resolveImportPath(rootType: TypingImport, typeName: string, outputPath: string): string;
/** Given the right hand side of an arg definition, returns the underlying "named type" for us to add to the builder */
export declare function getArgNamedType(argDef: AllNexusArgsDefs | string): AllNamedInputTypeDefs | string;
export declare function getNexusNamedType(type: AllNexusTypeDefs | NexusMetaType | GraphQLType | string): AllNexusNamedTypeDefs | GraphQLNamedType | string;
/** Assertion utility with nexus-aware feedback for users. */
export declare function invariantGuard(val: any): void;
/** Is the current stage production? If NODE_ENV envar is set to "production" or "prod" then yes it is. */
export declare function isProductionStage(): boolean;
/** Throw a programmer error in production but only log it in development. */
export declare function raiseProgrammerError(error: Error): void;
export declare class Unreachable extends Error {
    constructor(val: never);
}
export declare function graphql15InterfaceConfig<T extends GraphQLInterfaceTypeConfig<any, any>>(config: T): T & {
    interfaces: GraphQLInterfaceType[];
};
export declare function graphql15InterfaceType<T extends GraphQLInterfaceType>(type: T & {
    getInterfaces?: () => ReadonlyArray<GraphQLInterfaceType>;
}): T & {
    getInterfaces(): ReadonlyArray<GraphQLInterfaceType>;
};
/**
 * A specially typed version of `Array.isArray` to work around [this
 * issue](https://github.com/microsoft/TypeScript/issues/17002).
 */
export declare function isArray<T>(arg: T | {}): arg is T extends readonly any[] ? (unknown extends T ? never : readonly any[]) : any[];
export declare const ownProp: {
    has<O extends object, K extends keyof O>(obj: O, key: K): boolean;
    set<O_1 extends object, K_1 extends keyof O_1>(obj: O_1, key: K_1, value: O_1[K_1]): O_1[K_1];
    get<O_2 extends object, K_2 extends keyof O_2>(obj: O_2, key: K_2): O_2[K_2] | undefined;
};
export declare function result<T>(val: T | (() => T)): T;
