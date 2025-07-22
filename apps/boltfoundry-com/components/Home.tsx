import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
import { BfDsCopyButton } from "@bfmono/apps/bfDs/index.ts";
import { useRouter } from "../contexts/RouterContext.tsx";

export const Home = iso(`
  field Query.Home @component {
    __typename
    githubRepoStats {
      stars
    }
  }
`)(function Home({ data }) {
  const { navigate } = useRouter();

  const bfCode = "aibff calibrate grader.deck.md";

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <main className="hero-section flexColumn">
        <div className="landing-content">
          <div className="hero-content">
            {/* GitHub button */}
            <BfDsButton
              variant="ghost"
              icon="brand-github"
              href="https://github.com/bolt-foundry/bolt-foundry"
              target="_blank"
            >
              {data?.githubRepoStats?.stars.toString() ?? "--"}
            </BfDsButton>

            <h1 className="main">
              Structured prompts, reliable output
            </h1>
            <p>
              Open source tooling to turn prompt engineering into more science
              than art through structured, testable prompts
            </p>

            {/* NPM Install Section */}
            <div className="npm-command-container flexRow flexWrap gapMedium">
              <code className="npm-command">
                {bfCode}
              </code>
              <BfDsCopyButton
                aria-label="Copy command"
                textToCopy={bfCode}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <BfDsButton
                onClick={() => navigate("/ui")}
                variant="secondary"
                size="medium"
              >
                View UI Demo
              </BfDsButton>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="landing-footer">
        <div className="landing-content flexRow gapMedium alignItemsCenter">
          <div className="flex1">
            &copy; 2025 Bolt Foundry. All rights reserved.
          </div>
          <BfDsButton
            size="medium"
            variant="ghost"
            icon="brand-discord"
            iconOnly
            href="https://discord.gg/tU5ksTBfEj"
            target="_blank"
          />
          <BfDsButton
            size="medium"
            variant="ghost"
            icon="brand-github"
            iconOnly
            href="https://github.com/bolt-foundry/bolt-foundry"
            target="_blank"
          />
        </div>
      </div>
    </div>
  );
});
