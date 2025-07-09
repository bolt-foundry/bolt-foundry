import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import {
  type BfDsTabItem,
  BfDsTabs,
} from "@bfmono/apps/bfDs/components/BfDsTabs.tsx";
import { BfDsList } from "@bfmono/apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";
import { TestConversationInterface } from "./TestConversationInterface.tsx";

export function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<string>("system-prompt");
  const [inputVariables, setInputVariables] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [savedResults, setSavedResults] = useState("");
  const [groundTruth, setGroundTruth] = useState("");
  const [calibration, setCalibration] = useState("");
  const [evalPrompt, setEvalPrompt] = useState("");
  const [runEval, setRunEval] = useState("");

  // Create System Prompt tab content with accordion layout
  const systemPromptContent = (
    <div style={{ padding: "1rem", height: "100%", overflowY: "auto" }}>
      <BfDsList accordion>
        <BfDsListItem
          expandContents={
            <div style={{ padding: "1rem" }}>
              <WorkflowTextArea
                label="System Prompt"
                description="Define the system prompt for the AI."
                value={systemPrompt}
                onChange={setSystemPrompt}
                placeholder="You are a helpful assistant..."
              />
            </div>
          }
        >
          System Prompt
        </BfDsListItem>
        <BfDsListItem
          expandContents={
            <div style={{ padding: "1rem" }}>
              <WorkflowTextArea
                label="Input Variables"
                description="Define input variables as JSONL for prompt testing."
                value={inputVariables}
                onChange={setInputVariables}
                placeholder='{"variable1": "value1", "variable2": "value2"}\n{"variable1": "value3", "variable2": "value4"}'
              />
            </div>
          }
        >
          Input Variables
        </BfDsListItem>
        <BfDsListItem
          expandContents={
            <div style={{ padding: "1rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <h3
                  style={{
                    color: "#fafaff",
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  Test Conversation
                </h3>
                <p
                  style={{
                    color: "#b8b8c0",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.4",
                  }}
                >
                  Test your system prompt in an ephemeral conversation.
                </p>
              </div>
              <TestConversationInterface
                systemPrompt={systemPrompt}
                inputVariables={inputVariables}
              />
            </div>
          }
        >
          Test Conversation
        </BfDsListItem>
      </BfDsList>
    </div>
  );

  const tabs: Array<BfDsTabItem> = [
    {
      id: "system-prompt",
      label: "System Prompt",
      content: systemPromptContent,
    },
    {
      id: "calibrate",
      label: "Calibrate",
      content: (
        <div style={{ padding: "1rem", height: "100%", overflowY: "auto" }}>
          <BfDsList accordion>
            <BfDsListItem
              expandContents={
                <div style={{ padding: "1rem" }}>
                  <WorkflowTextArea
                    label="Saved Results"
                    description="Saved outputs from test conversations."
                    value={savedResults}
                    onChange={setSavedResults}
                    placeholder="Saved conversation outputs will appear here..."
                  />
                </div>
              }
            >
              Saved Results
            </BfDsListItem>
            <BfDsListItem
              expandContents={
                <div style={{ padding: "1rem" }}>
                  <WorkflowTextArea
                    label="Ground Truth"
                    description="Graded samples with explanations that become ground truth data."
                    value={groundTruth}
                    onChange={setGroundTruth}
                    placeholder="Ground truth samples will appear here..."
                  />
                </div>
              }
            >
              Ground Truth
            </BfDsListItem>
            <BfDsListItem
              expandContents={
                <div style={{ padding: "1rem" }}>
                  <WorkflowTextArea
                    label="Calibration"
                    description="Grade saved results (+3 to -3) with descriptions to generate ground truth."
                    value={calibration}
                    onChange={setCalibration}
                    placeholder="Calibration interface will appear here..."
                  />
                </div>
              }
            >
              Calibration
            </BfDsListItem>
          </BfDsList>
        </div>
      ),
    },
    {
      id: "eval",
      label: "Eval",
      content: (
        <div style={{ padding: "1rem" }}>
          <WorkflowTextArea
            label="Evaluation"
            description="Create and execute multiple graders per dimension against ground truth."
            value={evalPrompt}
            onChange={setEvalPrompt}
            placeholder="Grader creation and execution will appear here..."
            height="400px"
          />
        </div>
      ),
    },
    {
      id: "fix",
      label: "Fix",
      content: (
        <div style={{ padding: "1rem" }}>
          <WorkflowTextArea
            label="Fix"
            description="Analyze outliers and refine graders and system prompts."
            value={runEval}
            onChange={setRunEval}
            placeholder="Outlier analysis and refinement tools will appear here..."
            height="400px"
          />
        </div>
      ),
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    // console.log("Save workflow data:", {
    //   inputVariables,
    //   systemPrompt,
    //   testConversation,
    //   savedResults,
    //   groundTruth,
    //   calibration,
    //   evalPrompt,
    //   runEval,
    // });
  };

  return (
    <div
      style={{
        width: "400px",
        height: "100vh",
        backgroundColor: "#1a1b1c",
        borderLeft: "1px solid #3a3b3c",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tabbed Interface */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <BfDsTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="primary"
          size="medium"
        />
      </div>

      {/* Save Button */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        <BfDsButton
          onClick={handleSave}
          variant="primary"
          style={{ width: "100%" }}
        >
          Save Workflow
        </BfDsButton>
      </div>
    </div>
  );
}
