import type { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function LandingPageHero() {
  const lines = [
    {
      "style": "normal",
      "text": "Put your",
    },
    {
      "style": "blue-word",
      "text": "mom to work",
    },
  ];

  const elements = lines.map(({ style, text }, index: number) => {
    const styleClass = style === "normal" ? "hero-text" : "hero-text-blue";
    return <div key={index} className={styleClass}>{text}</div>;
  });

  return (
    <div className="landing-page-block">
      <div className="landing-page-hero">
        <div className="landing-page-title">
          {elements}
        </div>
        <div className="landing-page-text">
          <p>
            Customer testimonios is powerful. Bolt Foundry helps you take
            those stories and turn them into polished clips you can use
            anywhere.
          </p>
          <p>
            Let's work together to get the word out.
          </p>
        </div>
        <div style={{ width: "50%" }}>
          <BfDsButton
            href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
            hrefTarget="blank"
            text="Let's talk"
            size="xlarge"
          />
        </div>
      </div>
    </div>
  );
}
