import type { Source } from './source.d.ts';
/**
 * Represents a location in a Source.
 */
export interface SourceLocation {
  readonly line: number;
  readonly column: number;
}
/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */
export declare function getLocation(
  source: Source,
  position: number,
): SourceLocation;
