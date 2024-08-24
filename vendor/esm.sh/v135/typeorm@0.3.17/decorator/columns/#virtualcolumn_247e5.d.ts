import { ColumnType } from "../../driver/types/ColumnTypes.d.ts";
import { VirtualColumnOptions } from "../options/VirtualColumnOptions.d.ts";
/**
 * VirtualColumn decorator is used to mark a specific class property as a Virtual column.
 */
export declare function VirtualColumn(options: VirtualColumnOptions): PropertyDecorator;
/**
 * VirtualColumn decorator is used to mark a specific class property as a Virtual column.
 */
export declare function VirtualColumn(typeOrOptions: ColumnType, options: VirtualColumnOptions): PropertyDecorator;
