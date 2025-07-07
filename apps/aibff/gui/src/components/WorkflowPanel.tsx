import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsTabs } from "@bfmono/apps/bfDs/components/BfDsTabs.tsx";
import { SystemPromptTab } from "./SystemPromptTab.tsx";
import { CalibrationTab } from "./CalibrationTab.tsx";
import { EvalTab } from "./EvalTab.tsx";

interface WorkflowTab {
  id: string;
  label: string;
}

interface WorkflowPanelProps {
  conversationId?: string;
}

export function WorkflowPanel({ conversationId }: WorkflowPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("system-prompt");

  // State for all form fields
  const [systemPrompt, setSystemPrompt] = useState("");
  const [inputVariables, setInputVariables] = useState("");
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
            conversationId={conversationId}
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
    //   savedResults,
    //   calibration,
    //   groundTruth,
    //   evalPrompt,
    //   runEval,
    //   inputSamples,
    // });
  };

  return (
    <div className="workflow-panel">
      <BfDsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        size="small"
        variant="primary"
      >
        {renderTabContent()}
      </BfDsTabs>

      {/* Save Button */}
      <div className="workflow-panel-save-section">
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
