import type { GraphQLNamedType } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import type { SourceTypingDef } from './_types.d.ts';
export interface TypeExtensionConfig {
    asNexusMethod?: string;
    sourceType?: SourceTypingDef;
}
export declare function decorateType<T extends GraphQLNamedType>(type: T, config: TypeExtensionConfig): T;
