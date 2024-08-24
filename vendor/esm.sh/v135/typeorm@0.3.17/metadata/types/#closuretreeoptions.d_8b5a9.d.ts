/**
 * Tree type.
 * Specifies what table pattern will be used for the tree entity.
 */
import { ColumnMetadata } from "../ColumnMetadata.d.ts";
export interface ClosureTreeOptions {
    closureTableName?: string;
    ancestorColumnName?: (column: ColumnMetadata) => string;
    descendantColumnName?: (column: ColumnMetadata) => string;
}
