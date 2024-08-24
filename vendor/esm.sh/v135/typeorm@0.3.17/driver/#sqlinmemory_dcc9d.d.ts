import { Query } from "./Query.d.ts";
/**
 * This class stores up and down queries needed for migrations functionality.
 */
export declare class SqlInMemory {
    upQueries: Query[];
    downQueries: Query[];
}
