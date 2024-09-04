import { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";

export function LandingPageMission() {
  return (
    <div className="marketing-cta" style={{ alignItems: "start" }}>
      <div className="marketing-title">Our mission</div>
      <div className="marketing-text">
        Highlight key features and info.
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
