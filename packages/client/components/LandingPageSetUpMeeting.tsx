import * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { SetUpMeeting } from "packages/client/components/SetUpMeeting.tsx";

export function LandingPageSetUpMeeting(): React.ReactElement {
  //this is dumb, I know it's dumb.
  //this component is built to show different colors for different words. Right now I made the decision to have it all be the same color.
  const lines = [
    { "style": "normal", "text": "It's" },
    { "style": "normal", "text": "your" },
    { "style": "normal", "text": "content," },
    { "style": "normal", "text": "use" },
    { "style": "normal", "text": "more" },
    { "style": "normal", "text": "of" },
    { "style": "normal", "text": "it." },
  ];

  const elements = lines.map(({ style, text }, index: number) => {
    const textColor = style === "normal" ? "" : "text-brand-gold";
    const styleClass = `landing-page-set-up-meeting-headline ${textColor}`;
    //ensures consistent spacing as spaces will collapse between divs and spans when rendered inline-block.
    if (index != lines.length - 1) {
      text += "\u00A0";
    }
    return <div key={index} className={styleClass}>{text}</div>;
  });
  return (
    <div className="landing-page-set-up-meeting-section">
      <div className="landing-page-set-up-meeting-text-area">
        <div>
          {elements}
        </div>
        <div className="landing-page-set-up-meeting-cta">
          Schedule to see how Bolt Foundry can help!
        </div>
      </div>
      <div className="landing-page-book-a-meeting-button">
        <BfDsButton
          href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
          hrefTarget="blank"
          text="Book a meeting"
          size="xlarge"
        />
      </div>
    </div>
  );
}
