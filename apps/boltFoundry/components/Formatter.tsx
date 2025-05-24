import { useEffect, useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextArea } from "apps/bfDs/components/BfDsForm/BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsFormDropdownSelector } from "apps/bfDs/components/BfDsForm/BfDsFormDropdownSelector.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfSymbol } from "apps/bfDs/static/BfSymbol.tsx";
import { BfDsIcon } from "apps/bfDs/components/BfDsIcon.tsx";
import { BfDsRange } from "apps/bfDs/components/BfDsRange.tsx";
import { BfDsTooltipMenu } from "apps/bfDs/components/BfDsTooltipMenu.tsx";
import { BfDsDropdownSelector } from "apps/bfDs/components/BfDsDropdownSelector.tsx";
import { BfDsTabs } from "apps/bfDs/components/BfDsTabs.tsx";
import { BfDsSpinner } from "apps/bfDs/components/BfDsSpinner.tsx";
import {
  FormatterProvider,
  useFormatter,
} from "apps/boltFoundry/contexts/FormatterContext.tsx";
// GraphQL mutations  
import { createBolt, processPromptWithLLM, type LLMCard } from "apps/boltFoundry/mutations/graphqlMutations.ts";

const logger = getLogger(import.meta);


type PromptForm = {
  prompt: string;
};

type ForceExpand = "open" | "close" | null;

type ProviderType = keyof typeof options;
type ModelProps = {
  provider: ProviderType;
  model: string | null;
  key: string | null;
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
};

// TODO: Re-enable FormatterContent component once GraphQL schema is generated
// export const FormatterContent = iso(`...`);

export const Formatter = iso(`
field Query.Formatter @component {
  __typename
  }
`)(function Formatter() {
  const [ogPrompt, setOgPrompt] = useState<string | null>();
  const [originalBoltId, setOriginalBoltId] = useState<string | null>(null);
  const [currentBoltId, setCurrentBoltId] = useState<string | null>(null);
  const [forceExpand, setForceExpand] = useState<ForceExpand>(null);
  const [generatedCards, setGeneratedCards] = useState<LLMCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  const handleForceExpand = (value: ForceExpand) => {
    setForceExpand(value);
    setTimeout(() => {
      setForceExpand(null);
    }, 100);
  };

  return (
    <FormatterProvider>
      <div className="formatter-container flexRow">
        <div className="formatter-nav">
          <div className="formatter-logo">
            <BfLogo boltColor="var(--text)" foundryColor="var(--text)" />
          </div>
          <h1 className="formatter-nav-text">Formatter</h1>
        </div>
        {!ogPrompt
          ? (
            <div className="formatter-content flexColumn flex1 alignItemsCenter">
              <BfDsForm
                initialData={{ prompt: "" }}
                onSubmit={async (value: PromptForm) => {
                  setOgPrompt(value.prompt);
                  setIsProcessing(true);
                  setLlmError(null);
                  
                  try {
                    // Step 1: Save the original prompt as a bolt
                    const originalResult = await createBolt({
                      name: "Original Prompt",
                      description: "User's original prompt before formatting",
                      originalPrompt: value.prompt,
                    });
                    
                    if (originalResult.success && originalResult.id) {
                      setOriginalBoltId(originalResult.id);
                      logger.info("Created original bolt:", originalResult.message);
                      
                      // Step 2: Create a new bolt for the formatted version
                      const formattedResult = await createBolt({
                        name: "Formatted Bolt",
                        description: "Bolt Foundry formatted version of the original prompt",
                        originalPrompt: value.prompt,
                      });
                      
                      if (formattedResult.success && formattedResult.id) {
                        setCurrentBoltId(formattedResult.id);
                        logger.info("Created formatted bolt:", formattedResult.message);
                        
                        // Step 3: Process the prompt with LLM to generate cards
                        const llmResult = await processPromptWithLLM(value.prompt);
                        
                        if (llmResult.success && llmResult.data) {
                          setGeneratedCards(llmResult.data.cards);
                          logger.info("Generated cards:", llmResult.data.cards);
                        } else {
                          setLlmError(llmResult.error || "Failed to process prompt with LLM");
                          logger.error("Failed to process prompt with LLM:", llmResult.error);
                        }
                      } else {
                        logger.error("Failed to create formatted bolt:", formattedResult.message);
                      }
                    } else {
                      logger.error("Failed to create original bolt:", originalResult.message);
                    }
                  } catch (error) {
                    logger.error("Failed to create bolts:", error);
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                xstyle={{ ...formStyle, maxWidth: "600px" }}
              >
                <BfDsFormTextArea
                  id="prompt"
                  title={`Paste your prompt here. We'll apply the "Bolt Foundry Way" to it. Click "Make this good™" to compare.`}
                  rows={16}
                  placeholder="Paste your prompt here..."
                />
                <BfDsFormSubmitButton
                  kind="accent"
                  text="Make this good™"
                />
              </BfDsForm>
            </div>
          )
          : (
            <>
              <div className="flex1 flexColumn">
                <div className="formatter-toolbar flexRow gapMedium">
                  <BfDsButton
                    kind="overlay"
                    iconLeft="arrowLeft"
                    onClick={() => {
                      setOgPrompt(null);
                      setOriginalBoltId(null);
                      setCurrentBoltId(null);
                      setGeneratedCards([]);
                      setIsProcessing(false);
                      setLlmError(null);
                    }}
                  />
                  <BfDsButton
                    kind="overlay"
                    text="Expand"
                    onClick={() => handleForceExpand("open")}
                  />
                  <BfDsButton
                    kind="overlay"
                    text="Collapse"
                    onClick={() => handleForceExpand("close")}
                  />
                </div>
                <div className="formatter-content-main flex1 flexColumn gapLarge">
                  {/* {currentBoltId && <FormatterContent boltId={currentBoltId} forceExpand={forceExpand} />} */}
                  <div className="formatter-helper-text">
                    <div><strong>Formatting your prompt using the Bolt Foundry Way™</strong></div>
                    <div>Original bolt: {originalBoltId || "Not created"}</div>
                    <div>Current (formatted) bolt: {currentBoltId || "Not created"}</div>
                    <div style={{ marginTop: "16px", padding: "12px", background: "var(--surfaceColor)", borderRadius: "8px" }}>
                      <div><strong>Original prompt:</strong></div>
                      <div style={{ fontStyle: "italic", marginTop: "8px" }}>{ogPrompt}</div>
                    </div>
                  </div>
                  
                  {isProcessing && (
                    <div className="formatter-processing flexRow gapMedium alignItemsCenter" style={{ padding: "16px", background: "var(--surfaceColor)", borderRadius: "8px" }}>
                      <BfDsSpinner size={24} />
                      <div>Processing your prompt with LLM...</div>
                    </div>
                  )}
                  
                  {llmError && (
                    <div className="formatter-error" style={{ padding: "16px", background: "var(--errorBackground)", color: "var(--errorColor)", borderRadius: "8px" }}>
                      <div><strong>Error:</strong> {llmError}</div>
                    </div>
                  )}
                  
                  {generatedCards.length > 0 && (
                    <div className="formatter-generated-cards flexColumn gapMedium">
                      <div><strong>Generated Cards:</strong></div>
                      {generatedCards.map((card, index) => (
                        <Card
                          key={index}
                          forceExpand={forceExpand}
                          title={card.name}
                          kind={card.kind as "behavior" | "tool" | "persona" | null}
                          transition={null}
                          text={card.message}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="formatter-content-main-footer">
                  <div className="formatter-content-main-footer-inner flexRow gapMedium alignItemsCenter">
                    <div className="flex1 flexRow gapMedium alignItemsCenter">
                      <div>Formatted Bolt</div>
                      <BfDsButton iconLeft="pencil" kind="overlayDark" />
                    </div>
                    <BfDsButton
                      kind="secondary"
                      text="Save as new"
                      onClick={async () => {
                        if (currentBoltId) {
                          try {
                            const newBoltResult = await createBolt({
                              name: "Formatted Bolt (Copy)",
                              description: "Copy of formatted bolt",
                              originalPrompt: ogPrompt || "",
                            });
                            
                            if (newBoltResult.success && newBoltResult.id) {
                              setCurrentBoltId(newBoltResult.id);
                              logger.info("Created new bolt copy:", newBoltResult.message);
                            }
                          } catch (error) {
                            logger.error("Failed to create bolt copy:", error);
                          }
                        }
                      }}
                    />
                    <BfDsButton
                      kind="accent"
                      text="Save"
                      onClick={() => logger.info("TODO: Save bolt changes for ID:", currentBoltId)}
                    />
                  </div>
                </div>
              </div>
              <div className="formatter-content-sidebar flexColumn gapLarge">
                <RightSidebar />
              </div>
            </>
          )}
      </div>
    </FormatterProvider>
  );
});

type CardProps = {
  forceExpand: ForceExpand;
  id?: string;
  title: string;
  kind: "behavior" | "tool" | "persona" | null;
  transition: string | null;
  text: string;
  onUpdate?: (id: string, updates: any) => void;
};

function Card({ forceExpand, id, title, kind, transition, text, onUpdate }: CardProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (forceExpand === "open") {
      setExpanded(true);
    }
    if (forceExpand === "close") {
      setExpanded(false);
    }
  }, [forceExpand]);

  let kindText = "";
  if (kind === "behavior") {
    kindText = "Behavior";
  }
  if (kind === "tool") {
    kindText = "Tool";
  }
  return (
    <div className="formatter-card">
      <div
        className="formatter-card-header-row flexRow gapMedium alignItemsCenter"
        onClick={() => setExpanded(!expanded)}
      >
        <BfDsButton
          iconLeft="drag"
          kind="overlay"
          onClick={() => logger.info("TODO: drag")}
        />
        <div className="formatter-card-title flex1">
          {kindText && <span className="bold">{kindText}:&nbsp;</span>}
          {title}
        </div>
        <BfDsButton
          kind="overlay"
          iconLeft={expanded ? "arrowDown" : "arrowLeft"}
          onClick={() => setExpanded(!expanded)}
        />
        {kind && <BfDsButton kind="overlay" iconLeft="trash" />}
      </div>
      {expanded && (
        <div className="formatter-card-expanded">
          <div className="formatter-card-expanded-title">Edit {title}</div>
          <BfDsForm
            initialData={{ transition: transition ?? "", text: text }}
            onSubmit={(value) => {
              if (id && onUpdate) {
                onUpdate(id, {
                  transition: value.transition,
                  text: value.text,
                });
              } else {
                logger.info(
                  "TODO: Save card",
                  title,
                  value.transition,
                  value.text,
                );
              }
            }}
            xstyle={formStyle}
          >
            {transition && (
              <div className="formatter-card-input-group">
                <BfDsFormTextArea
                  id="transition"
                  rows={2}
                  value={transition}
                  title={`Transition Text`}
                  placeholder="Enter transition text that will be displayed before this content..."
                />
              </div>
            )}
            <div className="formatter-card-input-group">
              <BfDsFormTextArea
                id="text"
                rows={6}
                value={text}
                title={`Main Content`}
                placeholder={`Enter the main content for ${title}...`}
              />
            </div>
            <BfDsFormSubmitButton text="Save Changes" kind="accent" />
          </BfDsForm>
        </div>
      )}
    </div>
  );
}

type VariableCardProps = {
  forceExpand: ForceExpand;
  name: string;
  assistantTurn: string;
  userTurn: string;
};

function VariableCard(
  { forceExpand, name, assistantTurn, userTurn }: VariableCardProps,
) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (forceExpand === "open") {
      setExpanded(true);
    }
    if (forceExpand === "close") {
      setExpanded(false);
    }
  }, [forceExpand]);

  return (
    <div className="formatter-card">
      <div
        className="formatter-card-header-row flexRow gapMedium alignItemsCenter"
        onClick={() => setExpanded(!expanded)}
      >
        <BfDsButton
          iconLeft="drag"
          kind="overlay"
          onClick={() => logger.info("TODO: drag")}
        />
        <div className="formatter-card-title flex1">
          {name}
        </div>
        <BfDsButton
          kind="overlay"
          iconLeft={expanded ? "arrowDown" : "arrowLeft"}
          onClick={() => setExpanded(!expanded)}
        />
        <BfDsButton kind="overlay" iconLeft="trash" />
      </div>
      {expanded && (
        <div className="formatter-card-expanded">
          <div className="formatter-card-expanded-title">
            Edit Variable: {name}
          </div>
          <BfDsForm
            initialData={{ assistantTurn, userTurn }}
            onSubmit={(value) =>
              logger.info(
                "TODO: Save variable card",
                name,
                value.assistantTurn,
                value.userTurn,
              )}
            xstyle={formStyle}
          >
            <div className="formatter-card-input-group">
              <BfDsFormTextArea
                id="assistantTurn"
                rows={1}
                value={assistantTurn}
                title={`Assistant's Request`}
                placeholder="Enter what the assistant should ask for this variable..."
              />
            </div>
            <div className="formatter-card-input-group">
              <BfDsFormTextArea
                id="userTurn"
                rows={1}
                value={userTurn}
                title={`Default User Response`}
                placeholder="Enter the default value that the user might provide..."
              />
            </div>
            <BfDsFormSubmitButton text="Save Changes" kind="accent" />
          </BfDsForm>
        </div>
      )}
    </div>
  );
}

type TurnCardProps = {
  forceExpand: ForceExpand;
  speaker: string;
  message: string;
};

function TurnCard({ forceExpand, speaker, message }: TurnCardProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (forceExpand === "open") {
      setExpanded(true);
    }
    if (forceExpand === "close") {
      setExpanded(false);
    }
  }, [forceExpand]);

  return (
    <div className="formatter-card">
      <BfDsForm
        initialData={{ message, speaker }}
        onSubmit={(value) =>
          logger.info(
            "TODO: Save turn card",
            speaker,
            value.message,
          )}
      >
        <div
          className="formatter-card-header-row flexRow gapMedium alignItemsCenter"
          onClick={() => setExpanded(!expanded)}
        >
          <BfDsButton
            iconLeft="drag"
            kind="overlay"
            onClick={() => logger.info("TODO: drag")}
          />
          <div className="formatter-card-title flex1">
            <BfDsFormDropdownSelector
              id="speaker"
              options={{ "Assistant": "assistant", "User": "user" }}
              onChange={() => logger.info("TODO: Change speaker")}
            />
          </div>
          <BfDsButton
            kind="overlay"
            iconLeft={expanded ? "arrowDown" : "arrowLeft"}
            onClick={() => setExpanded(!expanded)}
          />
          <BfDsButton kind="overlay" iconLeft="trash" />
        </div>
        {expanded && (
          <div className="formatter-card-expanded">
            <div className="formatter-card-expanded-title">
              Edit {speaker} Turn
            </div>
            <div className="formatter-card-input-group" style={formStyle}>
              <BfDsFormTextArea
                id="message"
                rows={2}
                value={message}
                title={`Turn Content`}
                placeholder="Enter what the participant should say in this turn..."
              />
              <BfDsFormSubmitButton kind="accent" text="Save Changes" />
            </div>
          </div>
        )}
      </BfDsForm>
    </div>
  );
}

function RightSidebar() {
  const [activeTab, setActiveTab] = useState("Testing");
  return (
    <div className="flexColumn gapLarge">
      <BfDsTabs
        kind="header"
        tabs={[{ name: "Testing" }, { name: "Results" }]}
        onTabSelected={(tab: string) => setActiveTab(tab)}
        overrideSelectedTab={activeTab}
      />
      {activeTab === "Testing" && (
        <TestingTab setTabTEMP={() => setActiveTab("Results")} />
      )}
      {activeTab === "Results" && <ResultsTab />}
    </div>
  );
}

const options = {
  openai: {
    "gpt-4": "gpt-4",
    "gpt-3.5": "gpt-3.5",
  },
  anthropic: {
    "claude-2": "claude-2",
    "claude-instant-1": "claude-instant-1",
  },
};

type ModelPickerProps = {
  model: ModelProps;
  setModel: (model: ModelProps) => void;
};

function ModelPicker(
  { model, setModel }: ModelPickerProps,
) {
  const [provider, setProvider] = useState<ProviderType>(model.provider);
  const [editing, setEditing] = useState(false);

  const handleSubmit = (value: ModelProps) => {
    setModel(value);
    setEditing(false);
  };

  const noKey = !model.key || model.key === "";
  return (
    <div className="formatter-model-picker">
      {editing
        ? (
          <div className="formatter-model-picker-form">
            <BfDsForm
              initialData={model}
              onSubmit={(value) => handleSubmit(value)}
              xstyle={formStyle}
            >
              <BfDsFormDropdownSelector
                id="provider"
                options={{ "OpenAI": "openai", "Anthropic": "anthropic" }}
                onChange={(value) => setProvider(value as ProviderType)}
                title="Provider"
                xstyle={{ width: "100%" }}
              />
              <BfDsFormDropdownSelector
                id="model"
                options={options[provider]}
                title="Model"
                placeholder="Select a model..."
                xstyle={{ width: "100%" }}
              />
              <BfDsFormTextInput
                id="key"
                title="API Key"
                placeholder="Enter your API key..."
                meta="Your API key will only be sent to the provider's API and never stored on our servers."
              />
              <BfDsFormSubmitButton kind="success" text="Save Changes" />
            </BfDsForm>
          </div>
        )
        : (
          <div
            className="rowButton secondary flexRow gapMedium alignItemsCenter"
            onClick={() => setEditing(true)}
          >
            {noKey
              ? (
                <div>
                  <BfDsIcon name="cross" color="var(--alert)" />
                </div>
              )
              : (
                <div>
                  <BfDsIcon name="check" color="var(--secondaryColor)" />
                </div>
              )}
            <div className="bold">
              {model.provider ?? (
                <span className="alert">
                  Choose provider
                </span>
              )}:
            </div>
            <div>
              {model.model ?? <span className="alert">Choose model</span>}
            </div>
            {noKey && <div className="alert">No API key provided</div>}
          </div>
        )}
    </div>
  );
}

function TestingTab({ setTabTEMP }: { setTabTEMP: () => void }) {
  const {
    iterations,
    setIterations,
    model,
    setModel,
    validationType,
    setValidationType,
    variableValues,
    setVariableValue,
    compareBolt,
    setCompareBolt,
  } = useFormatter();

  return (
    <div>
      <div className="formatter-testing flexColumn gapLarge">
        <div className="formatter-testing-compare">
          <div className="formatter-testing-compare-title flexRow gapMedium">
            Base bolt to test against
          </div>
          <div className="formatter-helper-text">
            Each test will compare the output of the current bolt to the output
            of the base bolt
          </div>
          <BfDsTooltipMenu
            menu={[
              { label: "Original prompt", onClick: () => setCompareBolt("original") },
              { label: "Current bolt", onClick: () => setCompareBolt("current") },
            ]}
            position="bottom"
            justification="end"
          >
            <div className="ho rowButton secondary flexRow gapMedium alignItemsCenter">
              <div className="bolt-symbol">
                <BfSymbol color="var(--secondaryColor)" />
              </div>
              <div className="flex1">
                {compareBolt === "current" ? "Current bolt" : "Original prompt"}
              </div>
              <div className="ver">
                <BfDsIcon name="arrowDown" color="var(--secondaryColor)" />
              </div>
            </div>
          </BfDsTooltipMenu>
          <ModelPicker
            model={model}
            setModel={setModel}
          />
        </div>
        <div className="formatter-testing-options flexColumn gapMedium">
          <BfDsRange
            meta="Running more iterations may increase execution time but will provide more reliable statistical insights"
            value={iterations}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIterations(parseFloat(e.target.value))}
            min={1}
            max={100}
            label="Number of iterations"
          />
          <BfDsDropdownSelector
            kind="input"
            label="Validation type"
            value={validationType}
            onChange={(value) => setValidationType(value)}
            options={{ "JSON": "json", "Use concise answers": "concise" }}
            actions={[{
              label: "Add new validation",
              onClick: () => logger.info("TODO: Add new validation"),
            }]}
            xstyle={{ width: "100%" }}
          />
          <div className="formatter-testing-options-variables flexColumn gapMedium">
            <div className="bold">Variables</div>
            {/* TODO: Get variables from GraphQL data */}
            <div className="formatter-helper-text">
              Variables will be loaded from the current bolt
            </div>
          </div>
        </div>
        <BfDsButton
          kind="primary"
          text="Run test"
          onClick={setTabTEMP}
        />
      </div>
    </div>
  );
}

type Result = {
  message: string;
  time: string;
  tokens: number;
  status: "pass" | "fail";
};
type Results = {
  base: {
    boltName: string;
    results: Array<Result>;
  };
  new: {
    boltName: string;
    results: Array<Result>;
  };
} | null;

const TEST_RESULTS_1: Results = {
  base: {
    boltName: "Original prompt",
    results: [
      {
        message:
          "The date is May 22, 2026. Is there anything else I can help you with?",
        time: "0.91s",
        tokens: 13,
        status: "fail",
      },
    ],
  },
  new: {
    boltName: "Initial bolt",
    results: [
      {
        message: "May 22, 2026",
        time: "0.89s",
        tokens: 3,
        status: "pass",
      },
    ],
  },
};

const TEST_RESULTS_MANY: Results = {
  base: {
    boltName: "Original prompt",
    results: [
      {
        message:
          "The date is May 22, 2026. Is there anything else I can help you with?",
        time: "0.91s",
        tokens: 13,
        status: "fail",
      },
      {
        message:
          "The date is May 22, 2026. Is there anything else I can help you with?",
        time: "0.91s",
        tokens: 13,
        status: "fail",
      },
      {
        message:
          "The date is May 22, 2026. Is there anything else I can help you with?",
        time: "0.91s",
        tokens: 13,
        status: "fail",
      },
    ],
  },
  new: {
    boltName: "Initial bolt",
    results: [
      {
        message: "May 22, 2026",
        time: "0.89s",
        tokens: 3,
        status: "pass",
      },
      {
        message: "May 22, 2026",
        time: "0.89s",
        tokens: 3,
        status: "pass",
      },
      {
        message: "May 22, 2026",
        time: "0.89s",
        tokens: 3,
        status: "pass",
      },
    ],
  },
};

function ResultsTab() {
  const { iterations } = useFormatter();
  const [results, setResults] = useState<Results>(null);

  useEffect(() => {
    globalThis.setTimeout(() => {
      if (iterations === 1) {
        setResults(TEST_RESULTS_1);
      } else {
        setResults(TEST_RESULTS_MANY);
      }
    }, 3000);
  }, []);

  return (
    <div>
      {results == null
        ? (
          <div className="formatter-results-waiting flexRow gapMedium alignItemsCenter">
            <BfDsSpinner size={32} />
            <div className="flex1">Waiting for results...</div>
          </div>
        )
        : (
          <div className="flexColumn gapLarge">
            <div>
              <div>
                Ran <span className="bold">{iterations}</span>{" "}
                iteration{iterations === 1 ? "" : "s"}.
              </div>
              <div>
                Total time: <span className="bold">1.8s</span> (avg.{" "}
                <span className="bold">0.9s</span> per iteration)
              </div>
              <div>
                Total tokens: <span className="bold">16</span> (avg.{" "}
                <span className="bold">8</span>
                per iteration)
              </div>
            </div>
            {iterations === 1
              ? (
                <>
                  <div className="flexRow gapMedium">
                    <div className="formatter-result base flex1 flexColumn gapMedium">
                      <div className="title">{results.base.boltName}</div>
                      <div className="result flex1">
                        {results.base.results[0].message}
                      </div>
                      <div className="stats">
                        <span className="bold">
                          {results.base.results[0].time}
                        </span>,{" "}
                        <span className="bold">
                          {results.base.results[0].tokens}
                        </span>{" "}
                        tokens
                      </div>
                    </div>
                    <div className="formatter-result new flex1 flexColumn gapMedium">
                      <div className="title">{results.new.boltName}</div>
                      <div className="result flex1">
                        {results.new.results[0].message}
                      </div>
                      <div className="stats">
                        <span className="bold">
                          {results.new.results[0].time}
                        </span>,{" "}
                        <span className="bold">
                          {results.new.results[0].tokens}
                        </span>{" "}
                        tokens
                      </div>
                    </div>
                  </div>
                  <div className="formatter-results-summary flexColumn gapMedium">
                    <div className="title">Performance comparison</div>
                    <div className="flexRow gapMedium">
                      <div className="stat">
                        <div className="title">Response time</div>
                        <div className="value">
                          The formatted prompt was 2.2% faster (0.02s
                          difference)
                        </div>
                      </div>
                      <div className="stat">
                        <div className="title">Response length</div>
                        <div className="value">
                          The formatted prompt generated 76.9% less content (43
                          fewer characters)
                        </div>
                      </div>
                    </div>
                    <div className="stat">
                      <div className="title">Key differences</div>
                      <div className="value">
                        <div>
                          <span className="bold">Original</span>: 14 words / 68
                          characters
                        </div>
                        <div>
                          <span className="bold">Formatted</span>: 3 words / 10
                          characters
                        </div>
                      </div>
                      <div className="tip">
                        <span className="bold">Tip:</span>{" "}
                        Compare the responses above to see which produces more
                        specific, structured, and relevant results.
                      </div>
                    </div>
                  </div>
                </>
              )
              : (
                <>
                  <div className="flexRow gapMedium">
                    <div className="formatter-result base flex1 flexColumn gapMedium">
                      <div className="title">{results.base.boltName}</div>
                    </div>
                    <div className="formatter-result new flex1 flexColumn gapMedium">
                      <div className="title">{results.new.boltName}</div>
                    </div>
                  </div>
                  <div className="formatter-results-summary flexColumn gapMedium">
                    <div className="title">Performance comparison</div>
                    <div className="flexRow gapMedium">
                      <div className="stat">
                        <div className="title">Response time</div>
                        <div className="value">
                          The formatted prompt was 2.2% faster (0.02s
                          difference)
                        </div>
                      </div>
                      <div className="stat">
                        <div className="title">Response length</div>
                        <div className="value">
                          The formatted prompt generated 76.9% less content (43
                          fewer characters)
                        </div>
                      </div>
                    </div>
                    <div className="stat">
                      <div className="title">Key differences</div>
                      <div className="value">
                        <div>
                          <span className="bold">Original</span>: 14 words / 68
                          characters
                        </div>
                        <div>
                          <span className="bold">Formatted</span>: 3 words / 10
                          characters
                        </div>
                      </div>
                      <div className="tip">
                        <span className="bold">Tip:</span>{" "}
                        Compare the responses above to see which produces more
                        specific, structured, and relevant results.
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
        )}
    </div>
  );
}
