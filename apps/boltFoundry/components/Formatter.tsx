import { useEffect, useState } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfLogo } from "@bfmono/apps/bfDs/static/BfLogo.tsx";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextArea } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { BfDsCopyButton } from "@bfmono/apps/bfDs/components/BfDsCopyButton.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsFormDropdownSelector } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsFormDropdownSelector.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsFormTextInput } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfSymbol } from "@bfmono/apps/bfDs/static/BfSymbol.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { BfDsRange } from "@bfmono/apps/bfDs/components/BfDsRange.tsx";
import { BfDsTooltipMenu } from "@bfmono/apps/bfDs/components/BfDsTooltipMenu.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { BfDsDropdownSelector } from "@bfmono/apps/bfDs/components/BfDsDropdownSelector.tsx";
import { BfDsTabs } from "@bfmono/apps/bfDs/components/BfDsTabs.tsx";
import { BfDsSpinner } from "@bfmono/apps/bfDs/components/BfDsSpinner.tsx";

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
            <BfDsForm
              initialData={{ prompt: "" }}
              onSubmit={(value: PromptForm) => setOgPrompt(value.prompt)}
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
                  onClick={() => setOgPrompt(null)}
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
                <div className="formatter-section flexColumn gapMedium">
                  <div className="formatter-section-header flexRow gapMedium alignItemsCenter">
                    <h2 className="flex1">Cards</h2>
                    <div>
                      <BfDsCopyButton textToCopy="TODO" />
                    </div>
                    <div>
                      <BfDsButton
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
                      <BfDsButton
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
                  <BfDsForm
                    initialData={{ message: "", speaker: "assistant" }}
                    onSubmit={() => logger.info("TODO: Add turn")}
                  >
                    <div className="formatter-section-footer flexRow gapMedium alignItemsCenter">
                      <BfDsFormTextArea
                        id="message"
                        rows={1}
                        placeholder="Enter what the participant should say in this turn..."
                        xstyle={{ flex: 1 }}
                      />
                      <BfDsFormDropdownSelector
                        id="speaker"
                        options={{ "Assistant": "assistant", "User": "user" }}
                        onChange={() => logger.info("TODO: Change speaker")}
                      />
                      <BfDsFormSubmitButton
                        kind="secondary"
                        iconLeft="plus"
                        text="Turn"
                      />
                    </div>
                  </BfDsForm>
                </div>
              </div>
              <div className="formatter-content-main-footer">
                <div className="formatter-content-main-footer-inner flexRow gapMedium alignItemsCenter">
                  <div className="flex1 flexRow gapMedium alignItemsCenter">
                    <div>Bolt name</div>
                    <BfDsButton iconLeft="pencil" kind="overlayDark" />
                  </div>
                  <BfDsButton
                    kind="secondary"
                    text="Save as new"
                    onClick={() => logger.info("TODO: Save as new")}
                  />
                  <BfDsButton
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
          <BfDsTooltipMenu
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
            value={runs}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRuns(parseFloat(e.target.value))}
            min={1}
            max={100}
            label="Number of iterations"
          />
          <BfDsDropdownSelector
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
                <BfDsInput
                  label={variable.name}
                  value={variable.defaultValue}
                  onChange={() => logger.info("TODO: Change variable value")}
                />
              );
            })}
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
            <BfDsSpinner size={32} />
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
