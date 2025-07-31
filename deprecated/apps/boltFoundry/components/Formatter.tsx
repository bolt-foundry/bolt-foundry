import { useEffect, useState } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfLogo } from "@bfmono/apps/cfDs/static/BfLogo.tsx";
import { CfDsForm } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import { CfDsFormTextArea } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormTextArea.tsx";
import { CfDsFormSubmitButton } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormSubmitButton.tsx";
import { CfDsCopyButton } from "@bfmono/apps/cfDs/components/CfDsCopyButton.tsx";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { CfDsFormDropdownSelector } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormDropdownSelector.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { CfDsFormTextInput } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormTextInput.tsx";
import { BfSymbol } from "@bfmono/apps/cfDs/static/BfSymbol.tsx";
import { CfDsIcon } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { CfDsRange } from "@bfmono/apps/cfDs/components/CfDsRange.tsx";
import { CfDsTooltipMenu } from "@bfmono/apps/cfDs/components/CfDsTooltipMenu.tsx";
import { CfDsInput } from "@bfmono/apps/cfDs/components/CfDsInput.tsx";
import { CfDsDropdownSelector } from "@bfmono/apps/cfDs/components/CfDsDropdownSelector.tsx";
import { CfDsTabs } from "@bfmono/apps/cfDs/components/CfDsTabs.tsx";
import { CfDsSpinner } from "@bfmono/apps/cfDs/components/CfDsSpinner.tsx";

const logger = getLogger(import.meta);

// FAKE DATA
const data = {
  cards: [
    {
      title: "Intro",
      transition: null,
      text: "This is the intro card",
    },
    {
      title: "Assistant Persona",
      transition: "This is the assistant persona card",
      text: "You are a helpful assistant.",
    },
    {
      title: "User Persona",
      transition: "This is the user persona card",
      text: "You are a user.",
    },
  ],
  behaviors: [
    {
      title: "Behavior name",
      transition: "This is the behavior card",
      text: "You are helpful, creative, clever, and very friendly.",
    },
  ],
  tools: [
    {
      name: "confirm_fax_number",
      description:
        "Use this function to collect the phone number and verify it to use to send a fax.",
      parameters: {
        fax_number:
          "The phone number, should be displayed as a string of numbers, not words",
        verified: "Whether the fax number has been verified by the agent",
      },
    },
  ],
  variables: [
    {
      name: "post_description",
      description: "Description of the post",
      defaultValue: "This is a post",
    },
    {
      name: "post_platform",
      description: "Platform of the post",
      defaultValue: "Facebook",
    },
  ],
  turns: [
    {
      speaker: "assistant",
      message: "This is the assistant turn",
    },
    {
      speaker: "user",
      message: "This is the user turn",
    },
  ],
  bolts: [
    {
      name: "Original prompt",
      id: "1234",
    },
    {
      name: "Initial bolt",
      id: "5678",
    },
  ],
};

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

export const Formatter = iso(`
field Query.Formatter @component {
  __typename
  }
`)(function Formatter() {
  const [ogPrompt, setOgPrompt] = useState<string | null>();
  const [forceExpand, setForceExpand] = useState<ForceExpand>(null);

  const handleForceExpand = (value: ForceExpand) => {
    setForceExpand(value);
    setTimeout(() => {
      setForceExpand(null);
    }, 100);
  };

  return (
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
            <CfDsForm
              initialData={{ prompt: "" }}
              onSubmit={(value: PromptForm) => setOgPrompt(value.prompt)}
              xstyle={{ ...formStyle, maxWidth: "600px" }}
            >
              <CfDsFormTextArea
                id="prompt"
                title={`Paste your prompt here. We'll apply the "Bolt Foundry Way" to it. Click "Make this good™" to compare.`}
                rows={16}
                placeholder="Paste your prompt here..."
              />
              <CfDsFormSubmitButton
                kind="accent"
                text="Make this good™"
              />
            </CfDsForm>
          </div>
        )
        : (
          <>
            <div className="flex1 flexColumn">
              <div className="formatter-toolbar flexRow gapMedium">
                <CfDsButton
                  kind="overlay"
                  iconLeft="arrowLeft"
                  onClick={() => setOgPrompt(null)}
                />
                <CfDsButton
                  kind="overlay"
                  text="Expand"
                  onClick={() => handleForceExpand("open")}
                />
                <CfDsButton
                  kind="overlay"
                  text="Collapse"
                  onClick={() => handleForceExpand("close")}
                />
              </div>
              <div className="formatter-content-main flex1 flexColumn gapLarge">
                <div className="formatter-section flexColumn gapMedium">
                  <div className="formatter-section-header flexRow gapMedium alignItemsCenter">
                    <h2 className="flex1">Cards</h2>
                    <div>
                      <CfDsCopyButton textToCopy="TODO" />
                    </div>
                    <div>
                      <CfDsButton
                        iconLeft="plus"
                        kind="overlay"
                        onClick={() => logger.info("TODO: Add card")}
                      />
                    </div>
                  </div>
                  {data.cards.map((card) => {
                    return (
                      <Card
                        forceExpand={forceExpand}
                        key={card.title}
                        title={card.title}
                        kind={null}
                        transition={card.transition}
                        text={card.text}
                      />
                    );
                  })}
                  {data.behaviors.map((card) => {
                    return (
                      <Card
                        forceExpand={forceExpand}
                        key={card.title}
                        title={card.title}
                        kind="behavior"
                        transition={card.transition}
                        text={card.text}
                      />
                    );
                  })}
                  {data.tools.map((card) => {
                    return (
                      <Card
                        forceExpand={forceExpand}
                        key={card.name}
                        title={card.name}
                        kind="tool"
                        transition={null}
                        text={card.description}
                      />
                    );
                  })}
                </div>
                <div className="formatter-section flexColumn gapMedium">
                  <div className="formatter-section-header flexRow gapMedium alignItemsCenter">
                    <h2 className="flex1">Variable turns</h2>
                    <div>
                      <CfDsButton
                        iconLeft="plus"
                        kind="overlay"
                        onClick={() => logger.info("TODO: Add variable")}
                      />
                    </div>
                  </div>
                  {data.variables.map((variable) => {
                    return (
                      <VariableCard
                        forceExpand={forceExpand}
                        key={variable.name}
                        name={variable.name}
                        assistantTurn={`Please provide the value for ${variable.name}.`}
                        userTurn={variable.defaultValue}
                      />
                    );
                  })}
                </div>
                <div className="formatter-section flexColumn gapMedium">
                  <div className="formatter-section-header flexRow gapMedium alignItemsCenter">
                    <h2 className="flex1">Turns</h2>
                  </div>
                  {data.turns.map((turn, index) => {
                    return (
                      <TurnCard
                        forceExpand={forceExpand}
                        key={index}
                        speaker={turn.speaker}
                        message={turn.message}
                      />
                    );
                  })}
                  <CfDsForm
                    initialData={{ message: "", speaker: "assistant" }}
                    onSubmit={() => logger.info("TODO: Add turn")}
                  >
                    <div className="formatter-section-footer flexRow gapMedium alignItemsCenter">
                      <CfDsFormTextArea
                        id="message"
                        rows={1}
                        placeholder="Enter what the participant should say in this turn..."
                        xstyle={{ flex: 1 }}
                      />
                      <CfDsFormDropdownSelector
                        id="speaker"
                        options={{ "Assistant": "assistant", "User": "user" }}
                        onChange={() => logger.info("TODO: Change speaker")}
                      />
                      <CfDsFormSubmitButton
                        kind="secondary"
                        iconLeft="plus"
                        text="Turn"
                      />
                    </div>
                  </CfDsForm>
                </div>
              </div>
              <div className="formatter-content-main-footer">
                <div className="formatter-content-main-footer-inner flexRow gapMedium alignItemsCenter">
                  <div className="flex1 flexRow gapMedium alignItemsCenter">
                    <div>Bolt name</div>
                    <CfDsButton iconLeft="pencil" kind="overlayDark" />
                  </div>
                  <CfDsButton
                    kind="secondary"
                    text="Save as new"
                    onClick={() => logger.info("TODO: Save as new")}
                  />
                  <CfDsButton
                    kind="accent"
                    text="Save"
                    onClick={() => logger.info("TODO: Save")}
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
  );
});

type CardProps = {
  forceExpand: ForceExpand;
  title: string;
  kind: "behavior" | "tool" | null;
  transition: string | null;
  text: string;
};

function Card({ forceExpand, title, kind, transition, text }: CardProps) {
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
        <CfDsButton
          iconLeft="drag"
          kind="overlay"
          onClick={() => logger.info("TODO: drag")}
        />
        <div className="formatter-card-title flex1">
          {kindText && <span className="bold">{kindText}:&nbsp;</span>}
          {title}
        </div>
        <CfDsButton
          kind="overlay"
          iconLeft={expanded ? "arrowDown" : "arrowLeft"}
          onClick={() => setExpanded(!expanded)}
        />
        {kind && <CfDsButton kind="overlay" iconLeft="trash" />}
      </div>
      {expanded && (
        <div className="formatter-card-expanded">
          <div className="formatter-card-expanded-title">Edit {title}</div>
          <CfDsForm
            initialData={{ transition: transition ?? "", text: text }}
            onSubmit={(value) =>
              logger.info(
                "TODO: Save card",
                title,
                value.transition,
                value.text,
              )}
            xstyle={formStyle}
          >
            {transition && (
              <div className="formatter-card-input-group">
                <CfDsFormTextArea
                  id="transition"
                  rows={2}
                  value={transition}
                  title={`Transition Text`}
                  placeholder="Enter transition text that will be displayed before this content..."
                />
              </div>
            )}
            <div className="formatter-card-input-group">
              <CfDsFormTextArea
                id="text"
                rows={6}
                value={text}
                title={`Main Content`}
                placeholder={`Enter the main content for ${title}...`}
              />
            </div>
            <CfDsFormSubmitButton text="Save Changes" kind="accent" />
          </CfDsForm>
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
        <CfDsButton
          iconLeft="drag"
          kind="overlay"
          onClick={() => logger.info("TODO: drag")}
        />
        <div className="formatter-card-title flex1">
          {name}
        </div>
        <CfDsButton
          kind="overlay"
          iconLeft={expanded ? "arrowDown" : "arrowLeft"}
          onClick={() => setExpanded(!expanded)}
        />
        <CfDsButton kind="overlay" iconLeft="trash" />
      </div>
      {expanded && (
        <div className="formatter-card-expanded">
          <div className="formatter-card-expanded-title">
            Edit Variable: {name}
          </div>
          <CfDsForm
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
              <CfDsFormTextArea
                id="assistantTurn"
                rows={1}
                value={assistantTurn}
                title={`Assistant's Request`}
                placeholder="Enter what the assistant should ask for this variable..."
              />
            </div>
            <div className="formatter-card-input-group">
              <CfDsFormTextArea
                id="userTurn"
                rows={1}
                value={userTurn}
                title={`Default User Response`}
                placeholder="Enter the default value that the user might provide..."
              />
            </div>
            <CfDsFormSubmitButton text="Save Changes" kind="accent" />
          </CfDsForm>
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
      <CfDsForm
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
          <CfDsButton
            iconLeft="drag"
            kind="overlay"
            onClick={() => logger.info("TODO: drag")}
          />
          <div className="formatter-card-title flex1">
            <CfDsFormDropdownSelector
              id="speaker"
              options={{ "Assistant": "assistant", "User": "user" }}
              onChange={() => logger.info("TODO: Change speaker")}
            />
          </div>
          <CfDsButton
            kind="overlay"
            iconLeft={expanded ? "arrowDown" : "arrowLeft"}
            onClick={() => setExpanded(!expanded)}
          />
          <CfDsButton kind="overlay" iconLeft="trash" />
        </div>
        {expanded && (
          <div className="formatter-card-expanded">
            <div className="formatter-card-expanded-title">
              Edit {speaker} Turn
            </div>
            <div className="formatter-card-input-group" style={formStyle}>
              <CfDsFormTextArea
                id="message"
                rows={2}
                value={message}
                title={`Turn Content`}
                placeholder="Enter what the participant should say in this turn..."
              />
              <CfDsFormSubmitButton kind="accent" text="Save Changes" />
            </div>
          </div>
        )}
      </CfDsForm>
    </div>
  );
}

function RightSidebar() {
  const [activeTab, setActiveTab] = useState("Testing");
  return (
    <div className="flexColumn gapLarge">
      <CfDsTabs
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
            <CfDsForm
              initialData={model}
              onSubmit={(value) => handleSubmit(value)}
              xstyle={formStyle}
            >
              <CfDsFormDropdownSelector
                id="provider"
                options={{ "OpenAI": "openai", "Anthropic": "anthropic" }}
                onChange={(value) => setProvider(value as ProviderType)}
                title="Provider"
                xstyle={{ width: "100%" }}
              />
              <CfDsFormDropdownSelector
                id="model"
                options={options[provider]}
                title="Model"
                placeholder="Select a model..."
                xstyle={{ width: "100%" }}
              />
              <CfDsFormTextInput
                id="key"
                title="API Key"
                placeholder="Enter your API key..."
                meta="Your API key will only be sent to the provider's API and never stored on our servers."
              />
              <CfDsFormSubmitButton kind="success" text="Save Changes" />
            </CfDsForm>
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
                  <CfDsIcon name="cross" color="var(--alert)" />
                </div>
              )
              : (
                <div>
                  <CfDsIcon name="check" color="var(--secondaryColor)" />
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
  const [runs, setRuns] = useState(1);
  const [model, setModel] = useState<ModelProps>({
    provider: "openai",
    model: "gpt-4",
    key: null,
  });
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
          <CfDsTooltipMenu
            menu={data.bolts.map((bolt) => ({ label: bolt.name }))}
            position="bottom"
            justification="end"
          >
            <div className="ho rowButton secondary flexRow gapMedium alignItemsCenter">
              <div className="bolt-symbol">
                <BfSymbol color="var(--secondaryColor)" />
              </div>
              <div className="flex1">Original prompt</div>
              <div className="ver">
                <CfDsIcon name="arrowDown" color="var(--secondaryColor)" />
              </div>
            </div>
          </CfDsTooltipMenu>
          <ModelPicker
            model={model}
            setModel={setModel}
          />
        </div>
        <div className="formatter-testing-options flexColumn gapMedium">
          <CfDsRange
            meta="Running more iterations may increase execution time but will provide more reliable statistical insights"
            value={runs}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRuns(parseFloat(e.target.value))}
            min={1}
            max={100}
            label="Number of iterations"
          />
          <CfDsDropdownSelector
            label="Validation type"
            value="json"
            onChange={() => logger.info("TODO: Change validation type")}
            options={{ "JSON": "json", "User": "user" }}
            actions={[{
              label: "Add new validation",
              onClick: () => logger.info("TODO: Add new validation"),
            }]}
            xstyle={{ width: "100%" }}
          />
          <div className="formatter-testing-options-variables flexColumn gapMedium">
            <div className="bold">Variables</div>
            {data.variables.map((variable) => {
              return (
                <CfDsInput
                  label={variable.name}
                  value={variable.defaultValue}
                  onChange={() => logger.info("TODO: Change variable value")}
                />
              );
            })}
          </div>
        </div>
        <CfDsButton
          kind="primary"
          text="Run test"
          onClick={setTabTEMP}
        />
      </div>
    </div>
  );
}

type Result = {
  boltName: string;
  message: string;
  time: string;
  tokens: number;
};

function ResultsTab() {
  const [results, setResults] = useState<Array<Result>>([]);

  useEffect(() => {
    globalThis.setTimeout(() => {
      setResults([
        {
          boltName: "Original prompt",
          message:
            "The date is May 22, 2026. Is there anything else I can help you with?",
          time: "0.91s",
          tokens: 13,
        },
        {
          boltName: "Initial bolt",
          message: "May 22, 2026",
          time: "0.89s",
          tokens: 3,
        },
      ]);
    }, 3000);
  }, []);

  return (
    <div>
      {results.length === 0
        ? (
          <div className="formatter-results-waiting flexRow gapMedium alignItemsCenter">
            <CfDsSpinner size={32} />
            <div className="flex1">Waiting for results...</div>
          </div>
        )
        : (
          <div className="flexColumn gapLarge">
            <div>
              <div>
                Ran <span className="bold">1</span> iteration.
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
            <div className="flexRow gapMedium">
              <div className="formatter-result base flex1 flexColumn gapMedium">
                <div className="title">{results[0].boltName}</div>
                <div className="result flex1">{results[0].message}</div>
                <div className="stats">
                  <span className="bold">{results[0].time}</span>,{" "}
                  <span className="bold">{results[0].tokens}</span> tokens
                </div>
              </div>
              <div className="formatter-result new flex1 flexColumn gapMedium">
                <div className="title">{results[1].boltName}</div>
                <div className="result flex1">{results[1].message}</div>
                <div className="stats">
                  <span className="bold">{results[1].time}</span>,{" "}
                  <span className="bold">{results[1].tokens}</span> tokens
                </div>
              </div>
            </div>
            <div className="formatter-results-summary flexColumn gapMedium">
              <div className="title">Performance comparison</div>
              <div className="flexRow gapMedium">
                <div className="stat">
                  <div className="title">Response time</div>
                  <div className="value">
                    The formatted prompt was 2.2% faster (0.02s difference)
                  </div>
                </div>
                <div className="stat">
                  <div className="title">Response length</div>
                  <div className="value">
                    The formatted prompt generated 76.9% less content (43 fewer
                    characters)
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
          </div>
        )}
    </div>
  );
}
