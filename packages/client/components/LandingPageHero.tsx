import { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function LandingPageHero() {
  const lines = [
    { "style": "normal", "text": "Tell" },
    {
      "style": "blueWord",
      "text": "your story",
    },
  ];

  const elements = lines.map(({ style, text }, index: number) => {
    const styleClass = style === "normal" ? "hero-text" : "hero-text-blue";
    return <div key={index} className={styleClass}>{text}</div>;
  });

  const MarketingHeroStyleOverride = {
    background: "none",
    textAlign: "left",
  }

  return (
    <div className="marketing-hero" style={MarketingHeroStyleOverride}>
      <div className="marketing-title" style={{textAlign: "left"}}>{elements}</div>
      <div className="marketing-text" style={{textAlign: "left"}}> 
        Customer testimonials are powerful. Bolt Foundry helps you take those stories and turn them into polished clips you can use anywhere.
        <br />
        Let's work together to get the word out.
      </div>
      <div style={{width: "50%"}}>
        <BfDsButton
          text="Let's talk"
          type="submit"
          size="xlarge"
          role="Book a meeting"
          onClick={() => console.log("Book a meeting")}
          testId="button-contact-us"
        />
        </div>
    </div>
  );
}
