import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";

export function MarketingHero() {
  const lines = [
    { "style": "normal", "text": "New clips every day" },
    {
      "style": "blueWord",
      "text": "without a video editor",
    },
  ];

  const elements = lines.map(({ style, text }, index: number) => {
    const styleClass = style === "normal" ? "hero-text" : "hero-text-blue";
    return <div key={index} className={styleClass}>{text}</div>;
  });

  return (
    <div className="marketing-hero">
      <div className="marketing-title">{elements}</div>
      <div className="marketing-text">
        Upload your comedy set, get social media clips with no effort.
        <br />
        Trusted by dozens of clubs and comedians.
      </div>
      {
        /* <div className="row-column">
        <Button
          link="/contact"
          text={"Get in touch"}
          type="submit"
          size="xlarge"
          testId="button-signup-marketing-hero"
        />
      </div> */
      }
    </div>
  );
}
