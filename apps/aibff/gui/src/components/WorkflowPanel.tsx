import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { SystemPromptTab } from "./SystemPromptTab.tsx";
import { CalibrationTab } from "./CalibrationTab.tsx";
import { EvalTab } from "./EvalTab.tsx";

interface WorkflowTab {
  id: string;
  label: string;
}

export function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<string>("system-prompt");

  // State for all form fields
  const [systemPrompt, setSystemPrompt] = useState("");
  const [inputVariables, setInputVariables] = useState("");
  const [testConversation, setTestConversation] = useState("");
  const [savedResults, setSavedResults] = useState("");
  const [calibration, setCalibration] = useState("");
  const [groundTruth, setGroundTruth] = useState("");
  const [evalPrompt, setEvalPrompt] = useState("");
  const [runEval, setRunEval] = useState("");
  const [inputSamples, setInputSamples] = useState("");

  const tabs: Array<WorkflowTab> = [
    { id: "system-prompt", label: "System Prompt" },
    { id: "calibration", label: "Calibration" },
    { id: "eval", label: "Eval" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "system-prompt":
        return (
          <SystemPromptTab
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            inputVariables={inputVariables}
            onInputVariablesChange={setInputVariables}
            testConversation={testConversation}
            onTestConversationChange={setTestConversation}
          />
        );
      case "calibration":
        return (
          <CalibrationTab
            savedResults={savedResults}
            onSavedResultsChange={setSavedResults}
            calibration={calibration}
            onCalibrationChange={setCalibration}
            groundTruth={groundTruth}
            onGroundTruthChange={setGroundTruth}
          />
        );
      case "eval":
        return (
          <EvalTab
            evalPrompt={evalPrompt}
            onEvalPromptChange={setEvalPrompt}
            runEval={runEval}
            onRunEvalChange={setRunEval}
            inputSamples={inputSamples}
            onInputSamplesChange={setInputSamples}
          />
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    // console.log("Save workflow data:", {
    //   systemPrompt,
    //   inputVariables,
    //   testConversation,
    //   savedResults,
    //   calibration,
    //   groundTruth,
    //   evalPrompt,
    //   runEval,
    //   inputSamples,
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
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #3a3b3c",
          backgroundColor: "#1a1b1c",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              backgroundColor: activeTab === tab.id ? "#2a2b2c" : "#1a1b1c",
              color: "#fafaff",
              border: "none",
              borderBottom: activeTab === tab.id
                ? "2px solid #4a9eff"
                : "2px solid transparent",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 500,
              textAlign: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#232425";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#1a1b1c";
              }
            }}
          >
            {tab.label}
          </button>
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
        {renderTabContent()}
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
