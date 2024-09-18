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
      </div>
      <div
        className="landing-page-section-wrapper"
        id="landing-page-mission-section"
      >
        <LandingPageMission />
      </div>
      <div className="landing-page-section-wrapper landing-page-testimonial-section-wrapper">
      </div>
      <LandingPageSetUpMeeting />
      <div className="landing-page-bottom-logo">
        <BfLogo
          boltColor="var(--textSecondary)"
          foundryColor="var(--textSecondary)"
        />
      </div>
      <div className="landing-page-footer flexColumn">
        <div className="landing-page-footer-buttons flexRow">
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
        <div className="terms-and-privacy">
          <Link to="/terms-and-privacy">
            Terms and Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
