import { useState } from "react";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextArea } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "@bfmono/apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { DeckVisualization } from "@bfmono/apps/boltFoundry/components/DeckVisualization.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

const deckExamples = [
  {
    name: "Simple deck",
    deck: `
const deck = createDeck(
  "assistant",
  (b) =>
    b.card("persona", (c) =>
      c.spec("helpful and professional")
        .spec("patient and understanding"))
      .card("capabilities", (c) =>
        c.spec("code review", {
          samples: [
            { "id": "c_0", "userMessage": "Check my code for errors: {code}", "assistantResponse": "Line 7 needs a closing '}' bracket.", "score": 3, "description": "Provides specific line-by-line feedback" },
            { "id": "c_1", "userMessage": "Review this code", "assistantResponse": "Code looks fine", "score": -3, "description": "Says 'code looks fine' without details" },
          ]
        })),
);
`,
  },
  {
    name: "Behavior cards",
    deck: `
const deck = createDeck(
  "assistant",
  (d) =>
    d.card("Persona", (p) =>
      p.spec("Helpful and professional")
        .spec("Patient and understanding")
      )
     .card("Behaviors", (b) =>
        b.card("Oxford comma", (o) =>
          o.spec("Uses the Oxford comma", {
            samples: [
              { "id": "ox_0", "userMessage": "List three fruits", "assistantResponse": "I like apples, oranges, and bananas", "score": 3, "description": "Uses Oxford comma correctly" },
              { "id": "ox_1", "userMessage": "List three fruits", "assistantResponse": "I like apples, oranges and bananas", "score": -3, "description": "Missing Oxford comma" },
            ]
            })
          )
         .card("Contractions", (c) =>
            c.spec("Uses contractions as much as possible", {
              samples: [
                { "id": "con_0", "userMessage": "Where are you going?", "assistantResponse": "I'm going to the store", "score": 3, "description": "Uses contraction naturally" },
                { "id": "con_1", "userMessage": "Where are you going?", "assistantResponse": "I am going to the store", "score": -3, "description": "Formal instead of contraction" },
                { "id": "con_2", "userMessage": "What will you do?", "assistantResponse": "I will go to the store", "score": -3, "description": "Missed contraction opportunity" },
              ]
            })
             .spec("Doesn't use contractions for emphasis", {
               samples: [
                 { "id": "emp_0", "userMessage": "Is that really true?", "assistantResponse": "It isn't true", "score": -2, "description": "Contraction weakens emphasis" },
                 { "id": "emp_1", "userMessage": "Is that really true?", "assistantResponse": "It is not true", "score": 3, "description": "Full form for emphasis" },
               ]
             })
          ) 
    )
)
`,
  },
];

export function Decks() {
  const [deckString, setDeckString] = useState(deckExamples[0].deck);
  const [deckExampleIndex, setDeckExampleIndex] = useState(0);

  return (
    <div className="landing-page">
      <main>
        <div className="landing-content">
          <h1>Decks Demo</h1>
          <div className="flexColumn gapLarge">
            <div>
              <BfDsForm
                key={deckExampleIndex}
                initialData={{ deck: deckString }}
                onSubmit={(data) => {
                  setDeckString(data.deck);
                  setDeckExampleIndex(-1);
                }}
                xstyle={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <BfDsFormTextArea
                  id="deck"
                  rows={12}
                  xstyle={{ alignSelf: "stretch", maxHeight: 340 }}
                />
                <div className="flexRow gapMedium alignItemsCenter">
                  <div>Presets:</div>
                  {deckExamples.map((example, index) => {
                    return (
                      <BfDsButton
                        kind={index === deckExampleIndex
                          ? "danSelected"
                          : "dan"}
                        onClick={() => {
                          setDeckString(example.deck);
                          setDeckExampleIndex(index);
                        }}
                        text={example.name}
                        key={example.name}
                      />
                    );
                  })}
                  <div className="vertical-separator" />
                  <BfDsFormSubmitButton text="Update Visualization" />
                </div>
              </BfDsForm>
            </div>
            <div>
              <DeckVisualization deckString={deckString} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
