import type { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { LandingPageMissionImage } from "packages/client/components/LandingPageMissionImage.tsx";

export function LandingPageMission() {
  return (
    <div
      className="landing-page-section-wrapper"
      id="landing-page-mission-section"
    >
      <div className="landing-page-block">
        <div
          className="landing-page-mission-image"
          style={{
            background:
              "url(https://bf-static-assets.s3.amazonaws.com/marketing/BF-mission-bg.png) no-repeat center / contain",
          }}
        >
          <LandingPageMissionImage />
        </div>
      </div>
      <div className="landing-page-block">
        <div className="landing-page-mission">
          <div className="landing-page-title">Our mission</div>
          <div className="landing-page-text">
            We do the heavy lifting so you can do what you do best - create.
          </div>
          <BfDsButton
            href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
            hrefTarget="blank"
            text="Book a meeting"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
