import { useRef } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsCopyButton } from "apps/bfDs/components/BfDsCopyButton.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";

import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const Home = iso(`
field Query.Home @component {
    __typename
    githubRepoStats {
      stars
    }
  }
`)(function Home({ data }) {
  const { navigate } = useRouter();
  const substackRef = useRef<HTMLDivElement>(null);

  const scrollToSubstack = () => {
    if (substackRef.current) {
      substackRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-content flexRow gapLarge">
          <div className="flex1">
            <div className="header-logo">
              <BfLogo
                boltColor="var(--text)"
                foundryColor="var(--text)"
                height={24}
              />
            </div>
          </div>
          <nav className="alignItemsCenter flexRow gapLarge header-nav">
            <BfDsButton
              kind="overlay"
              href="https://substack.com/@boltfoundry"
              hrefTarget="_blank"
              rel="noopener noreferrer"
              text="Blog"
            />
            <BfDsButton kind="overlay" link="/docs" text="Docs" />
            <BfDsButton
              kind="overlay"
              href="https://discord.gg/tU5ksTBfEj"
              hrefTarget="_blank"
              rel="noopener noreferrer"
              text="Discord"
            />
            {
              /* <BfDsButton
              kind="outline"
              text="Login"
              onClick={() => navigate("/login")}
            /> */
            }
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section flexColumn">
        <div className="landing-content">
          <div className="hero-content">
            {/* Github button */}
            <BfDsButton
              kind="outline"
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
              <div className="npm-command-container">
                <code className="npm-command">
                  npm install @bolt-foundry/bolt-foundry
                </code>
                <BfDsCopyButton
                  aria-label="Copy npm command"
                  textToCopy="npm install @bolt-foundry/bolt-foundry"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="more-content flexCenter flexColumn mobile-hide">
          <BfDsButton iconLeft="arrowDown" onClick={scrollToSubstack} />
        </div>
      </main>

      {/* Substack Subscription */}
      <section className="substack-section" ref={substackRef}>
        <div className="landing-content">
          <div className="substack-container">
            <h2 className="substack-title">Stay updated</h2>

            {/* Substack email form */}
            <iframe
              src="https://boltfoundry.substack.com/embed"
              width="480"
              height="320"
              style={{ borderRadius: 8, maxWidth: "100%" }}
            >
            </iframe>

            <p className="substack-description">
              Get updates on structured prompt engineering from{" "}
              <a
                href="https://substack.com/@boltfoundry"
                target="_blank"
                rel="noopener noreferrer"
              >
                our Substack
              </a>
            </p>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              size="medium"
              kind="overlay"
              iconLeft="brand-discord"
              href="https://discord.gg/tU5ksTBfEj"
              hrefTarget="_blank"
            />
            <BfDsButton
              size="medium"
              kind="overlay"
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
