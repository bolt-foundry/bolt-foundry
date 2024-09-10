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
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { Link } from "packages/client/components/Link.tsx";

export function LandingPage(): React.ReactElement {
  return (
    <div className="marketing">
      <nav className="nav marketing-nav start-center">
        <div className="landing-page-logo">
          <Link to="/">
            <BfLogo />
          </Link>
        </div>
      </nav>
      <div className="landing-page-section-wrapper">
        <div className="landing-page-block">
          <LandingPageHero />
        </div>
        <div className="landing-page-block">
          <LandingPageClipCollection />
        </div>
      </div>
      <div className="landing-page-section-wrapper" id="landing-page-mission-section">
        <div className="landing-page-block">
          <div style={{background: "url(/resources/media/BF-mission_v2_word.jpeg) no-repeat center / contain", width: "100%", aspectRatio: "2/1", height: "100%"}}>
          </div>
        </div>
        <div className="landing-page-block">
          <LandingPageMission />
        </div>
      </div>
      <div className="landing-page-section-wrapper">
        <LandingPageTestimonials />
      </div>
      <LandingPageSetUpMeeting />
      <div className="landing-page-footer">
        <BfDsButton
          kind="outline"
          text="Terms and Privacy"
          href="/terms"
          hrefTarget="blank"
          testId="button-terms-footer"
        />
        <BfDsButton
          iconLeft="brand-tiktok"
          kind="outline"
          href="https://www.tiktok.com/@bolt.foundry"
          hrefTarget="_blank"
          size="large"
          tooltip="Follow us on TikTok!"
          role="TikTok social media link"
          testId="button-tiktok-footer"
        />
        <BfDsButton
          iconLeft="brand-instagram"
          kind="outline"
          href="https://www.instagram.com/boltfoundry/"
          hrefTarget="_blank"
          size="large"
          tooltip="Follow us on Instagram!"
          role="Instagram social media link"
          testId="button-instagram-footer"
        />
        <BfDsButton
          iconLeft="brand-threads"
          kind="outline"
          href="https://www.threads.net/@boltfoundry"
          hrefTarget="_blank"
          size="large"
          tooltip="Follow us on Threads!"
          role="Threads social media link"
          testId="button-threads-footer"
        />
        <BfDsButton
          iconLeft="brand-discord"
          kind="outline"
          href="https://discord.gg/ZTVJkfxHkC"
          hrefTarget="_blank"
          size="large"
          tooltip="Join our Discord!"
          tooltipPosition="top"
          tooltipJustification="end"
          role="Discord social media link"
          testId="button-discord-footer"
        />
      </div>
    </div>
  );
}
