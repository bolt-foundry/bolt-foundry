import { ChatPromptValueInterface } from "../prompt_values.d.ts";
import { RunnableLike, Runnable } from "../runnables/base.d.ts";
import { RunnableConfig } from "../runnables/config.d.ts";
import { InputValues } from "../utils/types/index.d.ts";
import { BaseMessagePromptTemplateLike, ChatPromptTemplate, ChatPromptTemplateInput } from "./chat.d.ts";
/**
 * Interface for the input of a ChatPromptTemplate.
 */
export interface StructuredPromptInput<RunInput extends InputValues = any, PartialVariableName extends string = any> extends ChatPromptTemplateInput<RunInput, PartialVariableName> {
    schema: Record<string, any>;
}
export declare class StructuredPrompt<RunInput extends InputValues = any, PartialVariableName extends string = any> extends ChatPromptTemplate<RunInput, PartialVariableName> implements StructuredPromptInput<RunInput, PartialVariableName> {
    schema: Record<string, any>;
    lc_namespace: string[];
    get lc_aliases(): Record<string, string>;
    constructor(input: StructuredPromptInput<RunInput, PartialVariableName>);
    pipe<NewRunOutput>(coerceable: RunnableLike<ChatPromptValueInterface, NewRunOutput>): Runnable<RunInput, Exclude<NewRunOutput, Error>, RunnableConfig>;
    static fromMessagesAndSchema<RunInput extends InputValues = any>(promptMessages: (ChatPromptTemplate<InputValues, string> | BaseMessagePromptTemplateLike)[], schema: StructuredPromptInput["schema"]): ChatPromptTemplate<RunInput, any>;
}
