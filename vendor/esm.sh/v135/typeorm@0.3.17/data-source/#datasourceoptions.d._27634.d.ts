import { CockroachConnectionOptions } from "../driver/cockroachdb/CockroachConnectionOptions.d.ts";
import { MysqlConnectionOptions } from "../driver/mysql/MysqlConnectionOptions.d.ts";
import { PostgresConnectionOptions } from "../driver/postgres/PostgresConnectionOptions.d.ts";
import { SqliteConnectionOptions } from "../driver/sqlite/SqliteConnectionOptions.d.ts";
import { SqlServerConnectionOptions } from "../driver/sqlserver/SqlServerConnectionOptions.d.ts";
import { OracleConnectionOptions } from "../driver/oracle/OracleConnectionOptions.d.ts";
import { MongoConnectionOptions } from "../driver/mongodb/MongoConnectionOptions.d.ts";
import { CordovaConnectionOptions } from "../driver/cordova/CordovaConnectionOptions.d.ts";
import { SqljsConnectionOptions } from "../driver/sqljs/SqljsConnectionOptions.d.ts";
import { ReactNativeConnectionOptions } from "../driver/react-native/ReactNativeConnectionOptions.d.ts";
import { NativescriptConnectionOptions } from "../driver/nativescript/NativescriptConnectionOptions.d.ts";
import { ExpoConnectionOptions } from "../driver/expo/ExpoConnectionOptions.d.ts";
import { AuroraMysqlConnectionOptions } from "../driver/aurora-mysql/AuroraMysqlConnectionOptions.d.ts";
import { SapConnectionOptions } from "../driver/sap/SapConnectionOptions.d.ts";
import { AuroraPostgresConnectionOptions } from "../driver/aurora-postgres/AuroraPostgresConnectionOptions.d.ts";
import { BetterSqlite3ConnectionOptions } from "../driver/better-sqlite3/BetterSqlite3ConnectionOptions.d.ts";
import { CapacitorConnectionOptions } from "../driver/capacitor/CapacitorConnectionOptions.d.ts";
import { SpannerConnectionOptions } from "../driver/spanner/SpannerConnectionOptions.d.ts";
/**
 * DataSourceOptions is an interface with settings and options for specific DataSource.
 */
export type DataSourceOptions = MysqlConnectionOptions | PostgresConnectionOptions | CockroachConnectionOptions | SqliteConnectionOptions | SqlServerConnectionOptions | SapConnectionOptions | OracleConnectionOptions | CordovaConnectionOptions | NativescriptConnectionOptions | ReactNativeConnectionOptions | SqljsConnectionOptions | MongoConnectionOptions | AuroraMysqlConnectionOptions | AuroraPostgresConnectionOptions | ExpoConnectionOptions | BetterSqlite3ConnectionOptions | CapacitorConnectionOptions | SpannerConnectionOptions;
