import type { GraphQLNamedType } from 'graphql';
import type { SourceTypingDef } from './_types';
export interface TypeExtensionConfig {
    asNexusMethod?: string;
    sourceType?: SourceTypingDef;
}
export declare function decorateType<T extends GraphQLNamedType>(type: T, config: TypeExtensionConfig): T;
