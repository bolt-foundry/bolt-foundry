import type { BuilderConfigInput } from './builder';
import type { TypegenMetadataConfig } from './typegenMetadata';
/** Normalizes the builder config into the config we need for typegen */
export declare function resolveTypegenConfig(config: BuilderConfigInput): TypegenMetadataConfig;
