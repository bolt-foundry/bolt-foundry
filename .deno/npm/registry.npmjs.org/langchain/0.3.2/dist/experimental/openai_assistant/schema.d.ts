import type { AgentFinish, AgentAction } from "@langchain/core/agents";
export type OpenAIAssistantFinish = AgentFinish & {
    runId: string;
    threadId: string;
};
export type OpenAIAssistantAction = AgentAction & {
    toolCallId: string;
    runId: string;
    threadId: string;
};
export type OpenAIToolType = Array<any>;
