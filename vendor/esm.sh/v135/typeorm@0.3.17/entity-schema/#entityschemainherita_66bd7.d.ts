import { ColumnOptions } from "../decorator/options/ColumnOptions.d.ts";
export interface EntitySchemaInheritanceOptions {
    /**
     * Inheritance pattern.
     */
    pattern?: "STI";
    /**
     * Inheritance discriminator column.
     */
    column?: string | ColumnOptions;
}
