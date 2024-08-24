import { GraphQLNamedType, GraphQLSchema } from 'graphql';
import type { TypegenInfo } from './builder';
import type { TypingImport } from './definitions/_types';
/** Any common types / constants that would otherwise be circular-imported */
export declare const SCALAR_TYPES: {
    Int: string;
    String: string;
    ID: string;
    Float: string;
    Boolean: string;
};
export interface SourceTypeModule {
    /**
     * The module for where to look for the types. This uses the node resolution algorithm via require.resolve,
     * so if this lives in node_modules, you can just provide the module name otherwise you should provide the
     * absolute path to the file.
     */
    module: string;
    /**
     * When we import the module, we use `import * as ____` to prevent conflicts. This alias should be a name
     * that doesn't conflict with any other types, usually a short lowercase name.
     */
    alias: string;
    /**
     * Provides a custom approach to matching for the type
     *
     * If not provided, the default implementation is:
     *
     * (type) => [ new RegExp(`(?:interface|type|class|enum)\\s+(${type.name})\\W`, "g"), ]
     */
    typeMatch?: (type: GraphQLNamedType, defaultRegex: RegExp) => RegExp | RegExp[];
    /**
     * A list of typesNames or regular expressions matching type names that should be resolved by this import.
     * Provide an empty array if you wish to use the file for context and ensure no other types are matched.
     */
    onlyTypes?: (string | RegExp)[];
    /**
     * By default the import is configured `import * as alias from`, setting glob to false will change this to
     * `import alias from`
     */
    glob?: false;
}
export interface SourceTypesConfigOptions {
    /** Any headers to prefix on the generated type file */
    headers?: string[];
    /**
     * Array of SourceTypeModule's to look in and match the type names against.
     *
     * @example
     *   modules: [
     *     { module: 'typescript', alias: 'ts' },
     *     { module: path.join(__dirname, '../sourceTypes'), alias: 'b' },
     *   ]
     */
    modules: SourceTypeModule[];
    /**
     * Types that should not be matched for a source type,
     *
     * By default this is set to ['Query', 'Mutation', 'Subscription']
     *
     * @example
     *   skipTypes: ['Query', 'Mutation', /(.*?)Edge/, /(.*?)Connection/]
     */
    skipTypes?: (string | RegExp)[];
    /**
     * If debug is set to true, this will log out info about all types found, skipped, etc. for the type
     * generation files. @default false
     */
    debug?: boolean;
    /**
     * If provided this will be used for the source types rather than the auto-resolve mechanism above. Useful
     * as an override for one-off cases, or for scalar source types.
     */
    mapping?: Record<string, string>;
}
/**
 * This is an approach for handling type definition auto-resolution. It is designed to handle the most common
 * cases, as can be seen in the examples / the simplicity of the implementation.
 *
 * If you wish to do something more complex, involving full AST parsing, etc, you can provide a different
 * function to the `typegenInfo` property of the `makeSchema` config.
 *
 * @param options
 */
export declare function typegenAutoConfig(options: SourceTypesConfigOptions, contextType: TypingImport | undefined): (schema: GraphQLSchema, outputPath: string) => Promise<TypegenInfo>;
