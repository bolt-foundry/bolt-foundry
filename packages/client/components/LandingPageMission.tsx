
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { LandingPageMissionImage } from "packages/client/components/LandingPageMissionImage.tsx";

export function LandingPageMission() {
  return (
    <div className="landing-page-mission-section">
      <div className="landing-page-block">
        <div className="landing-page-mission-image">
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
            text="Let's talk"
            size="xlarge"
          />
        </div>
      </div>
    </div>
  );
}
