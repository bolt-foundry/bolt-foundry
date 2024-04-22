import type { BuilderConfigInput } from './builder.d.ts';
import type { TypegenMetadataConfig } from './typegenMetadata.d.ts';
/** Normalizes the builder config into the config we need for typegen */
export declare function resolveTypegenConfig(config: BuilderConfigInput): TypegenMetadataConfig;
