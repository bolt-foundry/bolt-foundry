import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import {
  type BfDsTabItem,
  BfDsTabs,
} from "@bfmono/apps/bfDs/components/BfDsTabs.tsx";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

export function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<string>("system-prompt");
  const [inputVariables, setInputVariables] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [testConversation, setTestConversation] = useState("");
  const [savedResults, setSavedResults] = useState("");
  const [groundTruth, setGroundTruth] = useState("");
  const [calibration, setCalibration] = useState("");
  const [evalPrompt, setEvalPrompt] = useState("");
  const [runEval, setRunEval] = useState("");

  // Create System Prompt tab content with consolidated sections
  const systemPromptContent = (
    <div style={{ padding: "1rem", height: "100%", overflowY: "auto" }}>
      <WorkflowTextArea
        label="System Prompt"
        description="Define the system prompt for the AI."
        value={systemPrompt}
        onChange={setSystemPrompt}
        placeholder="You are a helpful assistant..."
        height="200px"
      />
      <WorkflowTextArea
        label="Input Variables"
        description="Define input variables as JSONL for prompt testing."
        value={inputVariables}
        onChange={setInputVariables}
        placeholder='{"variable1": "value1", "variable2": "value2"}\n{"variable1": "value3", "variable2": "value4"}'
        height="150px"
      />
      <WorkflowTextArea
        label="Test Conversation"
        description="Test your system prompt in an ephemeral conversation."
        value={testConversation}
        onChange={setTestConversation}
        placeholder="Test conversation will appear here..."
        height="200px"
      />
      <WorkflowTextArea
        label="Saved Results"
        description="Saved outputs from test conversations."
        value={savedResults}
        onChange={setSavedResults}
        placeholder="Saved conversation outputs will appear here..."
        height="150px"
      />
      <WorkflowTextArea
        label="Ground Truth"
        description="Graded samples with explanations that become ground truth data."
        value={groundTruth}
        onChange={setGroundTruth}
        placeholder="Ground truth samples will appear here..."
        height="150px"
      />
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
        <div style={{ padding: "1rem" }}>
          <WorkflowTextArea
            label="Calibration"
            description="Grade saved results (+3 to -3) with descriptions to generate ground truth."
            value={calibration}
            onChange={setCalibration}
            placeholder="Calibration interface will appear here..."
            height="400px"
          />
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
