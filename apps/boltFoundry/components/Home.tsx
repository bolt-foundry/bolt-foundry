import { useRef, useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsCopyButton } from "apps/bfDs/components/BfDsCopyButton.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const Home = iso(`
field Query.Home @component {
    __typename
  }
`)(function Home() {
  const { navigate } = useRouter();
  const [subscribing, setSubscribing] = useState(false);
  const substackRef = useRef<HTMLDivElement>(null);

  const subscribe = () => {
    setSubscribing(true);
    // TODO: Implement subscription logic
    setTimeout(() => {
      setSubscribing(false);
      logger.info("Subscribed!");
    }, 2000);
  };

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
            <a
              href="https://substack.com/@boltfoundry"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              Blog
            </a>
            <a href="/docs" className="nav-link">
              Docs
            </a>
            <a
              href="https://discord.gg/tU5ksTBfEj"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              Discord
            </a>
            <BfDsButton
              kind="outline"
              text="Login"
              onClick={() => navigate("/login")}
            />
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
              iconLeft="star"
              text="7"
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
                  kind="success"
                  aria-label="Copy npm command"
                  textToCopy="npm install @bolt-foundry/bolt-foundry"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="more-content flexCenter flexColumn">
          <BfDsButton iconLeft="arrowDown" onClick={scrollToSubstack} />
        </div>
      </main>

      {/* Substack Subscription */}
      <section className="substack-section" ref={substackRef}>
        <div className="landing-content">
          <div className="substack-container">
            <div className="substack-section">
              <h2 className="substack-title">Stay updated</h2>

              {/* Substack email form */}
              <BfDsForm
                initialData={{ email: "" }}
                onSubmit={subscribe}
                xstyle={{ display: "flex", flexDirection: "row", gap: 8 }}
              >
                <BfDsFormTextInput id="email" placeholder="Email address" />
                <BfDsFormSubmitButton
                  text="Subscribe"
                  showSpinner={subscribing}
                  disabled={subscribing}
                />
              </BfDsForm>

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
        </div>
      </section>
    </div>
  );
});
