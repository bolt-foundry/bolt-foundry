import { DeferrableType } from "../metadata/types/DeferrableType.d.ts";
export interface EntitySchemaUniqueOptions {
    /**
     * Unique constraint name.
     */
    name?: string;
    /**
     * Unique column names.
     */
    columns?: ((object?: any) => any[] | {
        [key: string]: number;
    }) | string[];
    /**
     * Indicate if unique constraints can be deferred.
     */
    deferrable?: DeferrableType;
}
