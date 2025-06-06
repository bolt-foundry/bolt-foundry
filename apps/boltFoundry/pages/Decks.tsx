import { useState } from "react";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextArea } from "apps/bfDs/components/BfDsForm/BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { DeckVisualization } from "apps/boltFoundry/components/DeckVisualization.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";

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
          samples: (s) =>
            s.sample("Provides specific line-by-line feedback", 3)
              .sample("Says 'code looks fine' without details", -3),
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
            samples: (s) =>
              s.sample("I like apples, oranges, and bananas", 3)
               .sample("I like apples, oranges and bananas", -3)
            })
          )
         .card("Contractions", (c) =>
            c.spec("Uses contractions as much as possible", {
              samples: (s) =>
                s.sample("I'm going to the store", 3)
                 .sample("I am going to the store", -3)
                 .samples("I will go to the store", -3)
            })
             .spec("Doesn't use contractions for emphasis", {
               samples: (s) =>
                 s.sample("It isn't true", -2)
                  .sample("It is not true", 3)
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
          <div className="flexRow gapMedium">
            {deckExamples.map((example, index) => {
              return (
                <BfDsButton
                  kind={index === deckExampleIndex ? "danSelected" : "dan"}
                  onClick={() => {
                    setDeckString(example.deck);
                    setDeckExampleIndex(index);
                  }}
                  text={example.name}
                  key={example.name}
                />
              );
            })}
          </div>
          <div>
            <div>
              <BfDsForm
                key={deckExampleIndex}
                initialData={{ deck: deckString }}
                onSubmit={(data) => {
                  setDeckString(data.deck);
                  setDeckExampleIndex(-1);
                }}
              >
                <BfDsFormTextArea id="deck" rows={12} />
                <BfDsFormSubmitButton text="Update Visualization" />
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
