import { ParseOptions } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { Source } from './loaders.d.ts';
import { SchemaPrintOptions } from './types.d.ts';
export declare function parseGraphQLJSON(location: string, jsonContent: string, options: SchemaPrintOptions & ParseOptions): Source;
