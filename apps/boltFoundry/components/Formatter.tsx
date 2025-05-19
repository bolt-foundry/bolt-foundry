import // @ts-types="react"
React, { useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextArea } from "apps/bfDs/components/BfDsForm/BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { BfDsCopyButton } from "apps/bfDs/components/BfDsCopyButton.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsFormDropdownSelector } from "apps/bfDs/components/BfDsForm/BfDsFormDropdownSelector.tsx";

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
};

type PromptForm = {
  prompt: string;
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  maxWidth: "600px",
};

export const Formatter = iso(`
field Query.Formatter @component {
  __typename
  }
`)(function Formatter() {
  const [ogPrompt, setOgPrompt] = useState<string | null>();
  return (
    <div className="formatter-container flexColumn">
      <div className="formatter-header">
        <div className="formatter-logo">
          <BfLogo boltColor="var(--text)" foundryColor="var(--text)" />
        </div>
        <div className="formatter-header-text">Formatter</div>
      </div>
      {ogPrompt
        ? (
          <div className="formatter-content flexColumn flex1 alignItemsCenter">
            <BfDsForm
              initialData={{ prompt: "" }}
              onSubmit={(value: PromptForm) => setOgPrompt(value.prompt)}
              xstyle={formStyle}
            >
              <BfDsFormTextArea
                id="prompt"
                title={`Paste your prompt here. We'll apply the "Bolt Foundry Way" to it. Click "Make this good™" to compare.`}
                rows={16}
                placeholder="Paste your prompt here..."
              />
              <BfDsFormSubmitButton text="Make this good™" />
            </BfDsForm>
          </div>
        )
        : (
          <div className="formatter-content flex1 flexRow">
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
                      onClick={() => console.log("TODO: Add card")}
                    />
                  </div>
                </div>
                {data.cards.map((card) => {
                  return (
                    <Card
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
                      onClick={() => console.log("TODO: Add variable")}
                    />
                  </div>
                </div>
                {data.variables.map((variable) => {
                  return (
                    <VariableCard
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
                      key={index}
                      speaker={turn.speaker}
                      message={turn.message}
                    />
                  );
                })}
              </div>
            </div>
            <div className="formatter-content-sidebar">
              <p>Formatter actions go here</p>
            </div>
          </div>
        )}
    </div>
  );
});

type CardProps = {
  title: string;
  kind: "behavior" | "tool" | null;
  transition: string | null;
  text: string;
};

function Card({ title, kind, transition, text }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  let kindText = "";
  if (kind === "behavior") {
    kindText = "Behavior";
  }
  if (kind === "tool") {
    kindText = "Tool";
  }
  return (
    <div className="formatter-card">
      <div className="flexRow gapMedium alignItemsCenter">
        <BfDsButton
          iconLeft="drag"
          kind="overlay"
          onClick={() => console.log("TODO: drag")}
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
          <BfDsForm
            initialData={{ transition: transition ?? "", text: text }}
            onSubmit={(value) =>
              console.log(
                "TODO: Save card",
                title,
                value.transition,
                value.text,
              )}
            xstyle={formStyle}
          >
            {transition && (
              <BfDsFormTextArea
                id="transition"
                rows={3}
                value={transition}
                label={`${title} Transition`}
              />
            )}
            <BfDsFormTextArea id="text" rows={10} value={text} label={title} />
            <BfDsFormSubmitButton text="Save" />
          </BfDsForm>
        </div>
      )}
    </div>
  );
}

type VariableCardProps = {
  name: string;
  assistantTurn: string;
  userTurn: string;
};

function VariableCard({ name, assistantTurn, userTurn }: VariableCardProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="formatter-card">
      <div className="flexRow gapMedium alignItemsCenter">
        <BfDsButton
          iconLeft="drag"
          kind="overlay"
          onClick={() => console.log("TODO: drag")}
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
          <BfDsForm
            initialData={{ assistantTurn, userTurn }}
            onSubmit={(value) =>
              console.log(
                "TODO: Save variable card",
                name,
                value.assistantTurn,
                value.userTurn,
              )}
            xstyle={formStyle}
          >
            <BfDsFormTextArea
              id="assistantTurn"
              rows={3}
              value={assistantTurn}
              label={`${name} Assistant Turn`}
            />
            <BfDsFormTextArea
              id="userTurn"
              rows={3}
              value={userTurn}
              label={`${name} User Turn`}
            />
            <BfDsFormSubmitButton text="Save" />
          </BfDsForm>
        </div>
      )}
    </div>
  );
}

type TurnCardProps = {
  speaker: string;
  message: string;
};

function TurnCard({ speaker, message }: TurnCardProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="formatter-card">
      <BfDsForm
        initialData={{ message, speaker }}
        onSubmit={(value) =>
          console.log(
            "TODO: Save turn card",
            speaker,
            value.message,
          )}
      >
        <div className="flexRow gapMedium alignItemsCenter">
          <BfDsButton
            iconLeft="drag"
            kind="overlay"
            onClick={() => console.log("TODO: drag")}
          />
          <div className="formatter-card-title flex1">
            <BfDsFormDropdownSelector
              id="speaker"
              options={{ "Assistant": "assistant", "User": "user" }}
              onChange={() => console.log("TODO: Change speaker")}
              title="Speaker"
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
          <div className="formatter-card-expanded" style={formStyle}>
            <BfDsFormTextArea
              id="message"
              rows={3}
              value={message}
              label={`${speaker} Turn`}
            />
            <BfDsFormSubmitButton text="Save" />
          </div>
        )}
      </BfDsForm>
    </div>
  );
}
