import { TableColumn } from "./TableColumn.d.ts";
import { TableIndex } from "./TableIndex.d.ts";
import { TableForeignKey } from "./TableForeignKey.d.ts";
import { Driver } from "../../driver/Driver.d.ts";
import { TableOptions } from "../options/TableOptions.d.ts";
import { EntityMetadata } from "../../metadata/EntityMetadata.d.ts";
import { TableUnique } from "./TableUnique.d.ts";
import { TableCheck } from "./TableCheck.d.ts";
import { TableExclusion } from "./TableExclusion.d.ts";
/**
 * Table in the database represented in this class.
 */
export declare class Table {
    readonly "@instanceof": symbol;
    /**
     * Database name that this table resides in if it applies.
     */
    database?: string;
    /**
     * Schema name that this table resides in if it applies.
     */
    schema?: string;
    /**
     * May contain database name, schema name and table name, unless they're the current database.
     *
     * E.g. myDB.mySchema.myTable
     */
    name: string;
    /**
     * Table columns.
     */
    columns: TableColumn[];
    /**
     * Table indices.
     */
    indices: TableIndex[];
    /**
     * Table foreign keys.
     */
    foreignKeys: TableForeignKey[];
    /**
     * Table unique constraints.
     */
    uniques: TableUnique[];
    /**
     * Table check constraints.
     */
    checks: TableCheck[];
    /**
     * Table exclusion constraints.
     */
    exclusions: TableExclusion[];
    /**
     * Indicates if table was just created.
     * This is needed, for example to check if we need to skip primary keys creation
     * for new tables.
     */
    justCreated: boolean;
    /**
     * Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
     */
    withoutRowid?: boolean;
    /**
     * Table engine.
     */
    engine?: string;
    constructor(options?: TableOptions);
    get primaryColumns(): TableColumn[];
    /**
     * Clones this table to a new table with all properties cloned.
     */
    clone(): Table;
    /**
     * Add column and creates its constraints.
     */
    addColumn(column: TableColumn): void;
    /**
     * Remove column and its constraints.
     */
    removeColumn(column: TableColumn): void;
    /**
     * Adds unique constraint.
     */
    addUniqueConstraint(uniqueConstraint: TableUnique): void;
    /**
     * Removes unique constraint.
     */
    removeUniqueConstraint(removedUnique: TableUnique): void;
    /**
     * Adds check constraint.
     */
    addCheckConstraint(checkConstraint: TableCheck): void;
    /**
     * Removes check constraint.
     */
    removeCheckConstraint(removedCheck: TableCheck): void;
    /**
     * Adds exclusion constraint.
     */
    addExclusionConstraint(exclusionConstraint: TableExclusion): void;
    /**
     * Removes exclusion constraint.
     */
    removeExclusionConstraint(removedExclusion: TableExclusion): void;
    /**
     * Adds foreign keys.
     */
    addForeignKey(foreignKey: TableForeignKey): void;
    /**
     * Removes foreign key.
     */
    removeForeignKey(removedForeignKey: TableForeignKey): void;
    /**
     * Adds index.
     */
    addIndex(index: TableIndex, isMysql?: boolean): void;
    /**
     * Removes index.
     */
    removeIndex(tableIndex: TableIndex, isMysql?: boolean): void;
    findColumnByName(name: string): TableColumn | undefined;
    /**
     * Returns all column indices.
     */
    findColumnIndices(column: TableColumn): TableIndex[];
    /**
     * Returns all column foreign keys.
     */
    findColumnForeignKeys(column: TableColumn): TableForeignKey[];
    /**
     * Returns all column uniques.
     */
    findColumnUniques(column: TableColumn): TableUnique[];
    /**
     * Returns all column checks.
     */
    findColumnChecks(column: TableColumn): TableCheck[];
    /**
     * Creates table from a given entity metadata.
     */
    static create(entityMetadata: EntityMetadata, driver: Driver): Table;
}
