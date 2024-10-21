
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function LandingPageHero() {
  const lines = [
    {
      "style": "normal",
      "text": "Put your",
    },
    {
      "style": "blue-word",
      "text": "video to work",
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
            Turn your library of testimonials, podcasts, and conference talks
            into polished video clips you can use anywhere.
          </p>
          <p>
            Let Bolt Foundry help you get more from your videos.
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
