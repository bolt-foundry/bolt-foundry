import { useState } from "react";
import { BfDsList } from "@bfmono/apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";
import { TestConversationUI } from "./TestConversationUI.tsx";

interface SystemPromptTabProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  inputVariables: string;
  onInputVariablesChange: (value: string) => void;
}

export function SystemPromptTab({
  systemPrompt,
  onSystemPromptChange,
  inputVariables,
  onInputVariablesChange,
}: SystemPromptTabProps) {
  // BfDsList will handle expansion state internally
  const [defaultExpanded] = useState(["system-prompt"]);

  return (
    <div className="system-prompt-tab">
      <BfDsList accordion={false}>
        <BfDsListItem
          expandContents={
            <WorkflowTextArea
              label="System Prompt"
              description="Define the main system prompt/actor deck content for the AI."
              value={systemPrompt}
              onChange={onSystemPromptChange}
              placeholder="# Actor Instructions\n\nYou are a helpful assistant that answers questions clearly and accurately..."
            />
          }
          expanded={defaultExpanded.includes("system-prompt")}
        >
          System Prompt
        </BfDsListItem>

        <BfDsListItem
          expandContents={
            <WorkflowTextArea
              label="Input Variables"
              description="Define input variables as JSONL for prompt testing."
              value={inputVariables}
              onChange={onInputVariablesChange}
              placeholder='{"variable1": "value1", "variable2": "value2"}\n{"variable1": "value3", "variable2": "value4"}'
            />
          }
        >
          Input Variables
        </BfDsListItem>

        <BfDsListItem
          expandContents={
            <div className="test-conversation-content">
              <div className="test-conversation-description">
                Test your system prompt in an ephemeral conversation.
              </div>
              <div className="test-conversation-ui">
                <TestConversationUI systemPrompt={systemPrompt} conversationId={conversationId} />
              </div>
            </div>
          }
        >
          Test Conversation
        </BfDsListItem>
      </BfDsList>
    </div>
  );
}
