import { StructuredTool } from "@langchain/core/tools";
/**
 * Type alias for StructuredTool. It is part of the tools module in
 * LangChain, which includes a variety of tools used for different
 * purposes.
 */
export type ObjectTool = StructuredTool;
export declare const FINISH_NAME = "finish";
/**
 * Interface that describes an action that can be performed by the AutoGPT
 * model in LangChain. It has a `name` property, which is a string that
 * represents the name of the action, and an `args` property, which is an
 * object that contains the arguments for the action.
 */
export interface AutoGPTAction {
    name: string;
    args: Record<string, any>;
}
