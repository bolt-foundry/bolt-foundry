import { GraphQLNamedType } from 'graphql';
import type { DynamicFieldDefs, SchemaConfig } from './builder';
import type { SourceTypings } from './definitions/_types';
import type { NexusOutputFieldConfig } from './definitions/definitionBlocks';
import type { NexusInputObjectTypeConfig } from './definitions/inputObjectType';
import type { NexusInterfaceTypeConfig } from './definitions/interfaceType';
import type { NexusObjectTypeConfig } from './definitions/objectType';
export declare type NexusGraphQLNamedType = GraphQLNamedType & {
    extensions?: {
        nexus?: {
            config: any;
        };
    };
};
export declare type NexusTypeExtensions = NexusObjectTypeExtension | NexusInterfaceTypeExtension;
/** Container object living on `fieldDefinition.extensions.nexus` */
export declare class NexusFieldExtension<TypeName extends string = any, FieldName extends string = any> {
    readonly config: Omit<NexusOutputFieldConfig<TypeName, FieldName>, 'resolve'>;
    /** Whether the user has provided a custom "resolve" function, or whether we're using GraphQL's defaultResolver */
    readonly hasDefinedResolver: boolean;
    constructor(config: NexusOutputFieldConfig<TypeName, FieldName>);
    /** Called when there are modifications on the interface fields */
    modify(modifications: Partial<NexusOutputFieldConfig<any, any>>): NexusFieldExtension<any, any>;
}
/** Container object living on `inputObjectType.extensions.nexus` */
export declare class NexusInputObjectTypeExtension<TypeName extends string = any> {
    readonly config: Omit<NexusInputObjectTypeConfig<TypeName>, 'definition'>;
    constructor(config: NexusInputObjectTypeConfig<TypeName>);
}
/** Container object living on `objectType.extensions.nexus` */
export declare class NexusObjectTypeExtension<TypeName extends string = any> {
    readonly config: Omit<NexusObjectTypeConfig<TypeName>, 'definition' | 'isTypeOf'>;
    constructor(config: NexusObjectTypeConfig<TypeName>);
}
/** Container object living on `interfaceType.extensions.nexus` */
export declare class NexusInterfaceTypeExtension<TypeName extends string = any> {
    readonly config: Omit<NexusInterfaceTypeConfig<TypeName>, 'definition' | 'resolveType'>;
    constructor(config: NexusInterfaceTypeConfig<TypeName>);
}
export interface NexusSchemaExtensionConfig extends Omit<SchemaConfig, 'types'> {
    dynamicFields: DynamicFieldDefs;
    sourceTypings: SourceTypings;
}
/**
 * Container object living on `schema.extensions.nexus`. Keeps track of metadata from the builder so we can
 * use it when we
 */
export declare class NexusSchemaExtension {
    readonly config: NexusSchemaExtensionConfig;
    constructor(config: NexusSchemaExtensionConfig);
}
