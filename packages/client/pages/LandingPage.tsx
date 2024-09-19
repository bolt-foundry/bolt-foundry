import type * as React from "react";
import { LandingPageFrame } from "packages/client/components/LandingPageFrame.tsx";
import { LandingPageHero } from "packages/client/components/LandingPageHero.tsx";
import { LandingPageMission } from "packages/client/components/LandingPageMission.tsx";
import { LandingPageClipCollection } from "packages/client/components/LandingPageClipCollection.tsx";
import { LandingPageTestimonials } from "packages/client/components/LandingPageTestimonials.tsx";
import { LandingPageSetUpMeeting } from "packages/client/components/LandingPageSetUpMeeting.tsx";
import { LandingPageFooter } from "packages/client/components/LandingPageFooter.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { Link } from "packages/client/components/Link.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";

export function LandingPage(): React.ReactElement {
  return (
    <LandingPageFrame>
      <div className="landing-page-section-wrapper">
        <LandingPageHero />
        <LandingPageTestimonialVideo />
      </div>
      <div className="landing-page-section-wrapper">
        <LandingPageMission />
      </div>
      <div className="landing-page-section-wrapper">
        <LandingPageSetUpMeeting />
      </div>
      <div className="landing-page-bottom-logo">
        <BfLogo
          boltColor="var(--textSecondary)"
          foundryColor="var(--textSecondary)"
        />
      </div>
      <LandingPageFooter />
    </LandingPageFrame>
  );
}

function LandingPageTestimonialVideo() {
  return (
    <div className="landing-page-block landing-page-testimonial-video-wrapper">
      <div className="flexRow flexCenter">
        <iframe
          className="landing-page-testimonial-video"
          src="https://www.youtube.com/embed/2UtVDS9YIZ0?si=RfeJTTYiGfdYtpkm&rel=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        >
        </iframe>
      </div>
    </div>
  );
}
