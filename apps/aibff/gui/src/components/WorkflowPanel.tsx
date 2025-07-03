import { useState } from "react";
import type * as React from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { WorkflowTabButton } from "./WorkflowTabButton.tsx";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";

interface WorkflowTab {
  id: string;
  label: string;
  component: React.ReactNode;
}

export function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState("input-variables");
  const [inputVariables, setInputVariables] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [promptOutput, setPromptOutput] = useState("");
  const [calibration, setCalibration] = useState("");
  const [evalPrompt, setEvalPrompt] = useState("");
  const [evalResults, setEvalResults] = useState("");
  const [edit, setEdit] = useState("");

  const tabs: Array<WorkflowTab> = [
    {
      id: "input-variables",
      label: "Input Variables",
      component: (
        <WorkflowTextArea
          label="Input Variables"
          description="Define input variables for the workflow."
          value={inputVariables}
          onChange={setInputVariables}
          placeholder="Define your input variables here..."
        />
      ),
    },
    {
      id: "system-prompt",
      label: "System Prompt",
      component: (
        <WorkflowTextArea
          label="System Prompt"
          description="Define the system prompt for the AI."
          value={systemPrompt}
          onChange={setSystemPrompt}
          placeholder="You are a helpful assistant..."
        />
      ),
    },
    {
      id: "prompt-output",
      label: "Prompt Output",
      component: (
        <WorkflowTextArea
          label="Prompt Output"
          description="View and edit the generated prompt output."
          value={promptOutput}
          onChange={setPromptOutput}
          placeholder="Generated prompt output will appear here..."
        />
      ),
    },
    {
      id: "calibration",
      label: "Calibration",
      component: (
        <WorkflowTextArea
          label="Calibration"
          description="Calibration settings and parameters."
          value={calibration}
          onChange={setCalibration}
          placeholder="Calibration parameters..."
        />
      ),
    },
    {
      id: "eval-prompt",
      label: "Eval Prompt",
      component: (
        <WorkflowTextArea
          label="Eval Prompt"
          description="Define the evaluation prompt."
          value={evalPrompt}
          onChange={setEvalPrompt}
          placeholder="Evaluation prompt..."
        />
      ),
    },
    {
      id: "eval-results",
      label: "Eval Results",
      component: (
        <WorkflowTextArea
          label="Eval Results"
          description="View evaluation results."
          value={evalResults}
          onChange={setEvalResults}
          placeholder="Evaluation results will appear here..."
        />
      ),
    },
    {
      id: "edit",
      label: "Edit",
      component: (
        <WorkflowTextArea
          label="Edit"
          description="Edit workflow settings."
          value={edit}
          onChange={setEdit}
          placeholder="Edit workflow settings..."
        />
      ),
    },
  ];

  const handleSave = () => {
    // TODO: Implement save functionality
    // console.log("Save workflow data:", {
    //   inputVariables,
    //   systemPrompt,
    //   promptOutput,
    //   calibration,
    //   evalPrompt,
    //   evalResults,
    //   edit,
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
      {/* Tab Header */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        {tabs.map((tab) => (
          <WorkflowTabButton
            key={tab.id}
            _id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#1a1b1c",
        }}
      >
        {tabs.find((tab) => tab.id === activeTab)?.component}
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
