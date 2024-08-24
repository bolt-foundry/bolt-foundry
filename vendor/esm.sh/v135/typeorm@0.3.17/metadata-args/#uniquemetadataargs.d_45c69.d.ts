import { DeferrableType } from "../metadata/types/DeferrableType.d.ts";
/**
 * Arguments for UniqueMetadata class.
 */
export interface UniqueMetadataArgs {
    /**
     * Class to which index is applied.
     */
    target: Function | string;
    /**
     * Unique constraint name.
     */
    name?: string;
    /**
     * Columns combination to be unique.
     */
    columns?: ((object?: any) => any[] | {
        [key: string]: number;
    }) | string[];
    /**
     * Indicate if unique constraints can be deferred.
     */
    deferrable?: DeferrableType;
}
