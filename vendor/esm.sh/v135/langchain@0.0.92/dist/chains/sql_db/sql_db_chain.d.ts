import { BaseChain, ChainInputs } from "../base.d.ts";
import type { SqlDatabase } from "../../sql_db.d.ts";
import { ChainValues } from "../../schema/index.d.ts";
import { SerializedSqlDatabaseChain } from "../serde.d.ts";
import { BaseLanguageModel } from "../../base_language/index.d.ts";
import { CallbackManagerForChainRun } from "../../callbacks/manager.d.ts";
import { PromptTemplate } from "../../prompts/index.d.ts";
export interface SqlDatabaseChainInput extends ChainInputs {
    llm: BaseLanguageModel;
    database: SqlDatabase;
    topK?: number;
    inputKey?: string;
    outputKey?: string;
    sqlOutputKey?: string;
    prompt?: PromptTemplate;
}
export declare class SqlDatabaseChain extends BaseChain {
    llm: BaseLanguageModel;
    database: SqlDatabase;
    prompt: PromptTemplate;
    topK: number;
    inputKey: string;
    outputKey: string;
    sqlOutputKey: string | undefined;
    returnDirect: boolean;
    constructor(fields: SqlDatabaseChainInput);
    /** @ignore */
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    _chainType(): "sql_database_chain";
    get inputKeys(): string[];
    get outputKeys(): string[];
    static deserialize(data: SerializedSqlDatabaseChain, SqlDatabaseFromOptionsParams: (typeof SqlDatabase)["fromOptionsParams"]): Promise<SqlDatabaseChain>;
    serialize(): SerializedSqlDatabaseChain;
    private verifyNumberOfTokens;
}
