import type * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { Link } from "packages/client/components/Link.tsx";

export function LandingPageFooter() {
  return (
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
  );
}
