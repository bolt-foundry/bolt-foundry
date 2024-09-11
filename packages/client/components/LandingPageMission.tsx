import type { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function LandingPageMission() {
  return (
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
  );
}
