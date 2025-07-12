import { useRef } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { CfDsCopyButton } from "@bfmono/apps/cfDs/components/CfDsCopyButton.tsx";
import { Nav } from "@bfmono/apps/boltFoundry/components/Nav.tsx";

export const Home = iso(`
field Query.Home @component {
    __typename
    githubRepoStats {
      stars
    }
  }
`)(function Home({ data }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const substackRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSubstack = () => {
    if (substackRef.current) {
      substackRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const bfCode = "npm install @bolt-foundry/bolt-foundry";
  const bfCode = "aibff calibrate grader.deck.md";

  return (
    <div className="landing-page">
      {/* Header */}
      <Nav />

      {/* Hero Section */}
      <main className="hero-section flexColumn" ref={heroRef}>
        <div className="landing-content">
          <div className="hero-content">
            {/* Github button */}
            <CfDsButton
              kind="dan"
              iconLeft="brand-github"
              text={data?.githubRepoStats?.stars.toString() ?? "--"}
              href="https://github.com/bolt-foundry/bolt-foundry"
              hrefTarget="_blank"
            />
            <h1 className="hero-headline">
              Structured prompts, reliable output
            </h1>
            <p className="hero-subhead">
              Open source tooling to turn prompt engineering into more science
              than art through structured, testable prompts
            </p>

            {/* NPM Install Section */}
            <div className="npm-section">
              <div className="npm-command-container flexRow flexWrap gapMedium">
                <code className="npm-command">
                  {bfCode}
                </code>
                <CfDsCopyButton
                  aria-label="Copy npm command"
                  textToCopy={bfCode}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="more-content flexCenter flexColumn mobile-hide">
          <CfDsButton iconLeft="arrowDown" onClick={scrollToSubstack} />
        </div>
      </main>

      {/* Contact Section */}
      <section className="substack-section" ref={substackRef}>
        <div className="landing-content">
          <div className="substack-container">
            <h2 className="substack-title">Get in touch</h2>
            <div className="substack-form">
              <div style={{ marginBottom: 12 }}>
                We're happy to have you here. Join our community or reach out
                directly.
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <CfDsButton
                  kind="dan"
                  iconLeft="brand-discord"
                  text="Join Discord"
                  href="https://discord.gg/tU5ksTBfEj"
                  hrefTarget="_blank"
                />
                <CfDsButton
                  kind="dan"
                  text="Email us"
                  href="mailto:dan@boltfoundry.com"
                />
                <div style={{ marginTop: 12 }}>
                  <CfDsButton
                    kind="danDim"
                    iconLeft="arrowUp"
                    text="Back to top"
                    onClick={scrollToTop}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <CfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-discord"
              href="https://discord.gg/tU5ksTBfEj"
              hrefTarget="_blank"
            />
            <CfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-github"
              href="https://github.com/bolt-foundry/bolt-foundry"
              hrefTarget="_blank"
            />
          </div>
        </div>
      </section>
    </div>
  );
});
