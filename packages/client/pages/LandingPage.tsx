import * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { LandingPageHero } from "packages/client/components/LandingPageHero.tsx";
import { ComingSoonHero } from "packages/client/components/ComingSoonHero.tsx";
import { MarketingCallToAction } from "packages/client/components/MarketingCallToAction.tsx";
import { LandingPageMission } from "packages/client/components/LandingPageMission.tsx";
import { LandingPageClipCollection } from "packages/client/components/LandingPageClipCollection.tsx";
import { LandingPageTestimonials } from "packages/client/components/LandingPageTestimonials.tsx";
import { LandingPageSetUpMeeting } from "packages/client/components/LandingPageSetUpMeeting.tsx";

export function LandingPage(): React.ReactElement {
  return (
    <MarketingFrame
      showLoginLink={false}
      showFooter={true}
    >
      <div className="landing-page-section-wrapper">
        <div className="landing-page-block">
          <LandingPageHero />
        </div>
        <div className="landing-page-block">
          <LandingPageClipCollection />
        </div>
      </div>
      <div className="landing-page-section-wrapper">
        <div className="landing-page-block">
          <div className="landing-page-video-placeholder"></div>
        </div>
        <div className="landing-page-block">
          <LandingPageMission />
        </div>
      </div>
      <div className="landing-page-section-wrapper">
        <LandingPageTestimonials />
      </div>
      <LandingPageSetUpMeeting />
    </MarketingFrame>
  );
}
