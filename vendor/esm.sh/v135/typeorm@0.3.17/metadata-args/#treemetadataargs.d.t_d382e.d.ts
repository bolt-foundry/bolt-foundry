import { TreeType } from "../metadata/types/TreeTypes.d.ts";
import { ClosureTreeOptions } from "../metadata/types/ClosureTreeOptions.d.ts";
/**
 * Stores metadata collected for Tree entities.
 */
export interface TreeMetadataArgs {
    /**
     * Entity to which tree is applied.
     */
    target: Function | string;
    /**
     * Tree type.
     */
    type: TreeType;
    /**
     * Tree options
     */
    options?: ClosureTreeOptions;
}
