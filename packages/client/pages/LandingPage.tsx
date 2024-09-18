import type * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { LandingPageHero } from "packages/client/components/LandingPageHero.tsx";
import { LandingPageMission } from "packages/client/components/LandingPageMission.tsx";
import { LandingPageClipCollection } from "packages/client/components/LandingPageClipCollection.tsx";
import { LandingPageTestimonials } from "packages/client/components/LandingPageTestimonials.tsx";
import { LandingPageSetUpMeeting } from "packages/client/components/LandingPageSetUpMeeting.tsx";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { Link } from "packages/client/components/Link.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";

export function LandingPage(): React.ReactElement {
  return (
    <div className="marketing">
      <nav className="nav landing-page-header">
        <div className="landing-page-logo">
          <Link to="/">
            <BfLogo />
          </Link>
        </div>
        <div className="landing-page-nav">
          <Link to="/blog">
            <div>Blog</div>
          </Link>
          <BfDsButton
            href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
            hrefTarget="blank"
            text="Let's talk"
            size="large"
          />
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
      <div
        className="landing-page-section-wrapper"
        id="landing-page-mission-section"
      >
        <LandingPageMission />
      </div>
      <div className="landing-page-section-wrapper landing-page-testimonial-section-wrapper">
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
          href="https://discord.gg/fQETC95grU"
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
