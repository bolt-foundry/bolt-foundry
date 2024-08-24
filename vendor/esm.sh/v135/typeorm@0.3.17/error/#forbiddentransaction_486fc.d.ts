import { Migration } from "../migration/Migration.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when the per-migration transaction mode is overriden but the global transaction mode is set to "all".
 */
export declare class ForbiddenTransactionModeOverrideError extends TypeORMError {
    constructor(migrationsOverridingTransactionMode: Migration[]);
}
