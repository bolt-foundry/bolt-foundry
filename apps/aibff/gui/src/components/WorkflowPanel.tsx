import { useCallback, useEffect, useState } from "react";
import { BfDsTabs } from "@bfmono/apps/bfDs/components/BfDsTabs.tsx";
import { WorkflowTextArea } from "./WorkflowTextArea.tsx";
import { TestConversation } from "./TestConversation.tsx";
import { CalibrationCard } from "./CalibrationCard.tsx";
import { GroundTruthItem } from "./GroundTruthItem.tsx";

interface WorkflowSection {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

interface WorkflowData {
  inputVariables: string;
  systemPrompt: string;
  savedResults: string;
  calibration: string;
  evalPrompt: string;
  runEval: string;
  files: string;
}

export function WorkflowPanel() {
  const [expandedSection, setExpandedSection] = useState<string>(
    "system-prompt",
  );
  const [inputVariables, setInputVariables] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [_testConversation, _setTestConversation] = useState("");
  const [savedResults, setSavedResults] = useState("");
  const [calibration, setCalibration] = useState("");
  const [activeCalibrationTab, setActiveCalibrationTab] = useState(
    "calibration",
  );
  const [evalPrompt, setEvalPrompt] = useState("");
  const [runEval, setRunEval] = useState("");
  const [files, setFiles] = useState("");
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o");
  const [activeEvalTab, setActiveEvalTab] = useState("eval-prompt");
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Parse savedResults text into structured items
  const parseSavedResults = (text: string) => {
    if (!text.trim()) return [];

    const items: Array<{
      id: string;
      input: string;
      output: string;
      timestamp?: string;
    }> = [];

    // Split by test result headers
    const sections = text.split(/# Test Result - /);

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split("\n");
      const timestamp = lines[0].trim();

      // Find the JSONL block
      const jsonlStart = section.indexOf("```jsonl\n");
      const jsonlEnd = section.indexOf("\n```", jsonlStart);

      if (jsonlStart !== -1 && jsonlEnd !== -1) {
        const jsonlContent = section.slice(jsonlStart + 8, jsonlEnd);
        const jsonLines = jsonlContent.split("\n").filter((line) =>
          line.trim()
        );

        // Parse each conversation into input/output pairs
        let currentInput = "";
        let currentOutput = "";

        for (const line of jsonLines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.role === "user") {
              currentInput = parsed.content;
            } else if (parsed.role === "assistant" && currentInput) {
              currentOutput = parsed.content;

              items.push({
                id: `${timestamp}-${items.length}`,
                input: currentInput,
                output: currentOutput,
                timestamp: timestamp,
              });

              currentInput = "";
              currentOutput = "";
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }

    return items;
  };

  // Parse calibration text into ground truth items
  const parseGroundTruth = (text: string) => {
    if (!text.trim()) return [];

    const items: Array<{
      id: string;
      input: string;
      output: string;
      score: number;
      timestamp?: string;
    }> = [];

    // Parse TOML-like format for ground truth items
    const sections = text.split("[[samples]]");

    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];

      try {
        // Extract input using regex
        const inputMatch = section.match(/input = """([\s\S]*?)"""/);
        const input = inputMatch ? inputMatch[1] : "";

        // Extract output using regex
        const outputMatch = section.match(/output = """([\s\S]*?)"""/);
        const output = outputMatch ? outputMatch[1] : "";

        // Extract score
        const scoreMatch = section.match(/score = (-?\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

        // Extract timestamp
        const timestampMatch = section.match(/timestamp = "([^"]+)"/);
        const timestamp = timestampMatch ? timestampMatch[1] : undefined;

        if (input && output) {
          items.push({
            id: `gt-${Date.now()}-${items.length}`,
            input,
            output,
            score,
            timestamp,
          });
        }
      } catch (_e) {
        // Skip invalid sections
      }
    }

    return items;
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [savedResultItems, setSavedResultItems] = useState<
    Array<{
      id: string;
      input: string;
      output: string;
      timestamp?: string;
    }>
  >([]);
  const [groundTruthItems, setGroundTruthItems] = useState<
    Array<{
      id: string;
      input: string;
      output: string;
      score: number;
      timestamp?: string;
    }>
  >([]);

  // Get conversation ID from URL or generate new one
  useEffect(() => {
    const urlParams = new URLSearchParams(globalThis.location.search);
    let id = urlParams.get("conversationId");

    if (!id) {
      // Generate a new conversation ID
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      id = `conv-${timestamp}-${random}`;

      // Update URL with the new conversation ID
      const newUrl = new URL(globalThis.location.href);
      newUrl.searchParams.set("conversationId", id);
      globalThis.history.replaceState({}, "", newUrl.toString());
    }

    setConversationId(id);
  }, []);

  // Load workflow data on mount
  useEffect(() => {
    if (!conversationId) return;

    const loadWorkflowData = async () => {
      try {
        const response = await fetch(
          `/api/conversations/${conversationId}/load`,
        );
        if (response.ok) {
          const data: WorkflowData = await response.json();
          setInputVariables(data.inputVariables || "");
          setSystemPrompt(data.systemPrompt || "");
          setSavedResults(data.savedResults || "");
          setCalibration(data.calibration || "");
          setEvalPrompt(data.evalPrompt || "");
          setRunEval(data.runEval || "");
          setFiles(data.files || "");
        }
      } catch {
        // Failed to load workflow data
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflowData();
  }, [conversationId]);

  // Parse saved results into structured items when savedResults changes
  useEffect(() => {
    const items = parseSavedResults(savedResults);
    setSavedResultItems(items);
  }, [savedResults]);

  // Parse calibration into ground truth items when calibration changes
  useEffect(() => {
    const items = parseGroundTruth(calibration);
    setGroundTruthItems(items);
  }, [calibration]);

  // Debounced save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: number;
      return (data: WorkflowData) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (!conversationId) return;

          setIsSaving(true);
          try {
            await fetch(`/api/conversations/${conversationId}/save`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
            // Show saved message after successful save
            setShowSavedMessage(true);
            setTimeout(() => setShowSavedMessage(false), 1500); // Show for 1.5 seconds
          } catch {
            // Failed to save workflow data
          } finally {
            setIsSaving(false);
          }
        }, 500); // 500ms debounce
      };
    })(),
    [conversationId],
  );

  // Auto-save when any workflow data changes
  useEffect(() => {
    if (isLoading || !conversationId) return;

    const workflowData: WorkflowData = {
      inputVariables,
      systemPrompt,
      savedResults,
      calibration,
      evalPrompt,
      runEval,
      files,
    };

    debouncedSave(workflowData);
  }, [
    inputVariables,
    systemPrompt,
    savedResults,
    calibration,
    evalPrompt,
    runEval,
    files,
    debouncedSave,
    isLoading,
    conversationId,
  ]);

  const sections: Array<WorkflowSection> = [
    {
      id: "system-prompt",
      label: "System Prompt",
      description:
        "Define the system prompt, input variables, and test conversation.",
      value: systemPrompt,
      onChange: setSystemPrompt,
      placeholder: "You are a helpful assistant...",
    },
    {
      id: "calibration",
      label: "Calibration",
      description: "Calibration settings and saved test results.",
      value: calibration,
      onChange: setCalibration,
      placeholder: "Calibration parameters...",
    },
    {
      id: "eval-prompt",
      label: "Evaluation",
      description: "Define evaluation prompts and run evaluations.",
      value: evalPrompt,
      onChange: setEvalPrompt,
      placeholder: "Evaluation prompt...",
    },
    {
      id: "files",
      label: "Fix",
      description: "File management and workflow settings.",
      value: files,
      onChange: setFiles,
      placeholder: "File management...",
    },
  ];

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      // Clicking on the currently expanded section collapses it
      setExpandedSection("");
    } else {
      // Clicking on any other section expands it and collapses the previous one
      setExpandedSection(sectionId);
    }
  };

  const handleSaveTestResult = (
    messages: Array<
      {
        id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
      }
    >,
  ) => {
    // Convert test conversation to JSONL format and add to saved results
    const jsonlResult = messages.map((msg) =>
      JSON.stringify({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })
    ).join("\n");

    const timestamp = new Date().toISOString();
    const newResult =
      `# Test Result - ${timestamp}\n\n\`\`\`jsonl\n${jsonlResult}\n\`\`\`\n\n`;

    setSavedResults((prev) => prev + newResult);

    // Show toast notification
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 1500);
  };

  // Handle scoring a saved result item
  const handleScore = (itemId: string, score: number) => {
    const item = savedResultItems.find((item) => item.id === itemId);
    if (!item) return;

    // Add to ground truth

    // Update calibration text with new ground truth item
    // For now, we'll append as simple text format
    const newGroundTruthEntry = `
[[samples]]
input = """${item.input}"""
output = """${item.output}"""
score = ${score}
timestamp = "${item.timestamp || new Date().toISOString()}"
`;

    setCalibration((prev) => prev + newGroundTruthEntry);

    // Remove from saved results
    // Find and remove the specific test result section that contains this item
    const sections = savedResults.split(/# Test Result - /);
    const updatedSections = sections.filter((section, index) => {
      if (index === 0) return true; // Keep the first empty section
      const timestamp = section.split("\n")[0].trim();
      return !itemId.includes(timestamp);
    });

    setSavedResults(updatedSections.join("# Test Result - "));
  };

  // Handle editing a ground truth score
  const handleEditGroundTruthScore = (
    newScore: number,
  ) => {
    // Update the score in the calibration text
    // This is a simplified implementation - in practice you'd want proper TOML parsing
    const updated = calibration.replace(
      new RegExp(
        `(input = """[^"]*"""\noutput = """[^"]*"""\nscore = )(-?\\d+)`,
        "g",
      ),
      (match) => {
        // This is a rough implementation - you'd want better matching
        return match.replace(/score = -?\d+/, `score = ${newScore}`);
      },
    );
    setCalibration(updated);
  };

  // Handle removing a ground truth item
  const handleRemoveGroundTruth = () => {
    // Remove the entire [[samples]] block that contains this item
    // This is simplified - you'd want proper TOML parsing
    const sections = calibration.split(/\[\[samples\]\]/);
    // For now, just remove the last added item (simplified)
    if (sections.length > 1) {
      sections.pop();
      setCalibration(sections.join("[[samples]]"));
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#1a1b1c",
          borderLeft: "1px solid #3a3b3c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fafaff",
        }}
      >
        Loading workflow...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#1a1b1c",
        borderLeft: "1px solid #3a3b3c",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Floating Save Status */}
      {(isSaving || showSavedMessage) && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "0.75rem 1.25rem",
            backgroundColor: isSaving ? "#2563eb" : "#059669",
            color: "#ffffff",
            fontSize: "0.875rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            transition: "all 0.2s ease-in-out",
            fontWeight: "500",
          }}
        >
          {isSaving ? "Saving..." : "Saved!"}
        </div>
      )}

      {/* Accordion Sections */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#1a1b1c",
        }}
      >
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} style={{ borderBottom: "1px solid #3a3b3c" }}>
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() =>
                  toggleSection(section.id)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: isExpanded ? "#2a2b2c" : "#1a1b1c",
                  color: "#fafaff",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#232425";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#1a1b1c";
                  }
                }}
              >
                <span>{section.label}</span>
                <span
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    fontSize: "0.75rem",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div style={{ padding: "0" }}>
                  {section.id === "system-prompt"
                    ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <WorkflowTextArea
                          label="System Prompt"
                          description="Define the system prompt for the AI."
                          value={systemPrompt}
                          onChange={setSystemPrompt}
                          placeholder="You are a helpful assistant..."
                        />
                        <WorkflowTextArea
                          label="Input Variables"
                          description="Define input variables as JSONL for prompt testing."
                          value={inputVariables}
                          onChange={setInputVariables}
                          placeholder='{"variable1": "value1", "variable2": "value2"}\n{"variable1": "value3", "variable2": "value4"}'
                        />
                        <TestConversation
                          systemPrompt={systemPrompt}
                          onSaveResult={handleSaveTestResult}
                          selectedModel={selectedModel}
                          onModelChange={setSelectedModel}
                          inputVariables={inputVariables}
                        />
                      </div>
                    )
                    : section.id === "calibration"
                    ? (
                      <div style={{ backgroundColor: "#1a1b1c" }}>
                        <BfDsTabs
                          activeTab={activeCalibrationTab}
                          onTabChange={setActiveCalibrationTab}
                          variant="secondary"
                          size="small"
                          tabs={[
                            {
                              id: "saved-results",
                              label:
                                `Saved Results (${savedResultItems.length})`,
                              content: (
                                <div style={{ padding: "1rem" }}>
                                  {savedResultItems.length === 0
                                    ? (
                                      <div
                                        style={{
                                          textAlign: "center",
                                          color: "#9ca3af",
                                          padding: "2rem",
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        No saved results yet. Save some test
                                        conversations to start calibrating your
                                        grader.
                                      </div>
                                    )
                                    : (
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "0.875rem",
                                            color: "#9ca3af",
                                            marginBottom: "1rem",
                                            lineHeight: "1.5",
                                          }}
                                        >
                                          Score these examples to create ground
                                          truth data for your grader. Each score
                                          will move the example to the Ground
                                          Truth tab.
                                        </div>
                                        {savedResultItems.map((item) => (
                                          <CalibrationCard
                                            key={item.id}
                                            item={item}
                                            onScore={handleScore}
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ),
                            },
                            {
                              id: "ground-truth",
                              label:
                                `Ground Truth (${groundTruthItems.length})`,
                              content: (
                                <div style={{ padding: "1rem" }}>
                                  {groundTruthItems.length === 0
                                    ? (
                                      <div
                                        style={{
                                          textAlign: "center",
                                          color: "#9ca3af",
                                          padding: "2rem",
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        No ground truth examples yet. Score some
                                        saved results to create your training
                                        data.
                                      </div>
                                    )
                                    : (
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "0.875rem",
                                            color: "#9ca3af",
                                            marginBottom: "1rem",
                                            lineHeight: "1.5",
                                          }}
                                        >
                                          Your labeled examples for grader
                                          calibration. You can edit scores or
                                          remove examples.
                                        </div>
                                        {groundTruthItems.map((item) => (
                                          <GroundTruthItem
                                            key={item.id}
                                            item={item}
                                            onEditScore={(_itemId, newScore) =>
                                              handleEditGroundTruthScore(
                                                newScore,
                                              )}
                                            onRemove={handleRemoveGroundTruth}
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ),
                            },
                          ]}
                        />
                      </div>
                    )
                    : section.id === "eval-prompt"
                    ? (
                      <div style={{ backgroundColor: "#1a1b1c" }}>
                        <BfDsTabs
                          activeTab={activeEvalTab}
                          onTabChange={setActiveEvalTab}
                          variant="secondary"
                          size="small"
                          tabs={[
                            {
                              id: "eval-prompt",
                              label: "Eval Prompt",
                              content: (
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
                              id: "run-eval",
                              label: "Run Eval",
                              content: (
                                <WorkflowTextArea
                                  label="Run Eval"
                                  description="Execute evaluations and view results."
                                  value={runEval}
                                  onChange={setRunEval}
                                  placeholder="Evaluation execution and results..."
                                />
                              ),
                            },
                          ]}
                        />
                      </div>
                    )
                    : (
                      <WorkflowTextArea
                        label={section.label}
                        description={section.description}
                        value={section.value}
                        onChange={section.onChange}
                        placeholder={section.placeholder}
                      />
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
