import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { RouterLink } from "@bfmono/apps/boltFoundry/components/Router/RouterLink.tsx";
import { CfLogo } from "@bfmono/apps/boltFoundry/resources/CfLogo.tsx";

export function MarketingFooter() {
  return (
    <div className="landing-page-footer">
      <div className="landing-page-bottom-logo">
        <CfLogo
          boltColor="var(--text015)"
          foundryColor="var(--text015)"
        />
      </div>
      <div className="flexColumn">
        <div className="landing-page-footer-buttons flexRow">
          <CfDsButton
            iconLeft="brand-tiktok"
            kind="outline"
            href="https://www.tiktok.com/@bolt.foundry"
            hrefTarget="_blank"
            size="large"
            tooltip="Follow us on TikTok!"
            role="TikTok social media link"
            testId="button-tiktok-footer"
          />
          <CfDsButton
            iconLeft="brand-instagram"
            kind="outline"
            href="https://www.instagram.com/contentfoundry/"
            hrefTarget="_blank"
            size="large"
            tooltip="Follow us on Instagram!"
            role="Instagram social media link"
            testId="button-instagram-footer"
          />
          <CfDsButton
            iconLeft="brand-threads"
            kind="outline"
            href="https://www.threads.net/@contentfoundry"
            hrefTarget="_blank"
            size="large"
            tooltip="Follow us on Threads!"
            role="Threads social media link"
            testId="button-threads-footer"
          />
          <CfDsButton
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
          <RouterLink to="/terms-and-privacy">
            Terms and Privacy
          </RouterLink>
        </div>
      </div>
    </div>
  );
}
