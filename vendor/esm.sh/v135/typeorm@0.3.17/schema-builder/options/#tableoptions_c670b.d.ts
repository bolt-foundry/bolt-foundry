import { TableColumnOptions } from "./TableColumnOptions.d.ts";
import { TableIndexOptions } from "./TableIndexOptions.d.ts";
import { TableForeignKeyOptions } from "./TableForeignKeyOptions.d.ts";
import { TableUniqueOptions } from "./TableUniqueOptions.d.ts";
import { TableCheckOptions } from "./TableCheckOptions.d.ts";
import { TableExclusionOptions } from "./TableExclusionOptions.d.ts";
/**
 * Table options.
 */
export interface TableOptions {
    /**
     * Table schema.
     */
    schema?: string;
    /**
     * Table database.
     */
    database?: string;
    /**
     * Table name.
     */
    name: string;
    /**
     * Table columns.
     */
    columns?: TableColumnOptions[];
    /**
     * Table indices.
     */
    indices?: TableIndexOptions[];
    /**
     * Table foreign keys.
     */
    foreignKeys?: TableForeignKeyOptions[];
    /**
     * Table unique constraints.
     */
    uniques?: TableUniqueOptions[];
    /**
     * Table check constraints.
     */
    checks?: TableCheckOptions[];
    /**
     * Table check constraints.
     */
    exclusions?: TableExclusionOptions[];
    /**
     * Indicates if table was just created.
     * This is needed, for example to check if we need to skip primary keys creation
     * for new tables.
     */
    justCreated?: boolean;
    /**
     * Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
     */
    withoutRowid?: boolean;
    /**
     * Table engine.
     */
    engine?: string;
}
