import type { Location } from './ast.d.ts';
import type { SourceLocation } from './location.d.ts';
import type { Source } from './source.d.ts';
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */
export declare function printLocation(location: Location): string;
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */
export declare function printSourceLocation(
  source: Source,
  sourceLocation: SourceLocation,
): string;
