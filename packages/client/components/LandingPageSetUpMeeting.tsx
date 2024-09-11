import type * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import type { SetUpMeeting } from "packages/client/components/SetUpMeeting.tsx";

export function LandingPageSetUpMeeting(): React.ReactElement {
  return (
    <div className="landing-page-set-up-meeting-section">
      <div className="landing-page-set-up-meeting-text-area">
        It's your content, use all of it.
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
