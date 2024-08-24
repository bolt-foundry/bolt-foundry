import { ColumnType } from "../driver/types/ColumnTypes.d.ts";
import { DatabaseType } from "../driver/types/DatabaseType.d.ts";
import { ColumnMetadata } from "../metadata/ColumnMetadata.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
export declare class DataTypeNotSupportedError extends TypeORMError {
    constructor(column: ColumnMetadata, dataType: ColumnType, database?: DatabaseType);
}
