import { useEffect, useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextArea } from "apps/bfDs/components/BfDsForm/BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { BfDsCopyButton } from "apps/bfDs/components/BfDsCopyButton.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsFormDropdownSelector } from "apps/bfDs/components/BfDsForm/BfDsFormDropdownSelector.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfDsDropdownSelector } from "apps/bfDs/components/BfDsDropdownSelector.tsx";
import { BfDsInput } from "apps/bfDs/components/BfDsInput.tsx";
import { BfDsTabs } from "apps/bfDs/components/BfDsTabs.tsx";
import { BfSymbol } from "apps/bfDs/static/BfSymbol.tsx";
import { BfDsIcon } from "apps/bfDs/components/BfDsIcon.tsx";
import { BfDsRange } from "apps/bfDs/components/BfDsRange.tsx";

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
  const [model, setModel] = useState<ModelProps>({
    provider: "openai",
    model: "gpt-4",
    key: "sk_FAKE_KEY",
  });
  const [showModelPicker, setShowModelPicker] = useState<boolean>(
    !model.model || !model.key,
  );

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
      {ogPrompt // TODO: change to !ogPrompt for real
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
            <div className="formatter-content-sidebar">
              <div className="formatter-section-header flexRow gapMedium alignItemsCenter">
                <h2 className="flex1">Testing</h2>
                <BfDsButton
                  kind="overlay"
                  text={(!model.model || !model.key)
                    ? "Choose a model"
                    : `${model.provider}: ${model.model}`}
                  onClick={() => setShowModelPicker(!showModelPicker)}
                />
              </div>
              {showModelPicker && (
                <ModelPicker
                  model={model}
                  setModel={setModel}
                  setShowModelPicker={setShowModelPicker}
                />
              )}
              <TestOptions />
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
        className="flexRow gapMedium alignItemsCenter"
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
        className="flexRow gapMedium alignItemsCenter"
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
          className="flexRow gapMedium alignItemsCenter"
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
  setShowModelPicker: (show: boolean) => void;
};

function ModelPicker(
  { model, setModel, setShowModelPicker }: ModelPickerProps,
) {
  const [provider, setProvider] = useState<ProviderType>(model.provider);

  const handleSubmit = (value: ModelProps) => {
    setModel(value);
    if (value.provider && value.model && value.key) {
      setShowModelPicker(false);
    }
  };

  return (
    <div className="formatter-model-picker">
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
        <BfDsFormSubmitButton kind="accent" text="Save Changes" />
      </BfDsForm>
    </div>
  );
}

function TestOptions() {
  const [runs, setRuns] = useState(1);
  return (
    <div>
      <div className="formatter-testing">
        <div className="formatter-testing-compare">
          <div className="formatter-testing-compare-title">Base</div>
          <div className="flexRow gapMedium alignItemsCenter">
            <div className="bolt-symbol">
              <BfSymbol />
            </div>
            <div className="flex1">Original prompt</div>
            <BfDsButton kind="overlay" iconLeft="pencil" />
          </div>
          <div className="flexRow gapMedium alignItemsCenter">
            <div>OpenAI</div>
            <div className="flex1">gpt-4</div>
            <div>
              <BfDsIcon name="check" />
            </div>
          </div>
        </div>
        <div className="formatter-testing-options">
          <BfDsRange
            value={runs}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRuns(parseFloat(e.target.value))}
            min={1}
            max={10}
            label="Number of iterations"
          />
        </div>
        {
          /* <BfDsDropdownSelector
          kind="input"
          label="Base bolt to compare against"
          options={data.bolts.reduce((acc, bolt) => {
            acc[bolt.name] = bolt.id;
            return acc;
          }, {} as Record<string, string>)}
          value={data.bolts[0].id}
          xstyle={{ width: "100%" }}
        />
        {data.variables.map((variable) => {
          return (
            <BfDsInput
              label={variable.name}
              value={variable.defaultValue}
            />
          );
        })} */
        }
      </div>
    </div>
  );
}
