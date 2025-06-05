import { useRef, useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { BfDsCopyButton } from "apps/bfDs/components/BfDsCopyButton.tsx";
// import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import joinWaitlistMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/JoinWaitlist/entrypoint.ts";

import { getLogger } from "packages/logger/logger.ts";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";

const logger = getLogger(import.meta);

type WaitlistFormData = {
  name: string;
  email: string;
  company: string;
};

const NavButtons = () => {
  return (
    <>
      {
        /* <BfDsButton
        kind="dan"
        href="https://boltfoundry.substack.com/"
        hrefTarget="_blank"
        rel="noopener noreferrer"
        text="Blog"
      /> */
      }
      <BfDsButton
        kind="dan"
        href="/docs"
        text="Docs"
      />
      <BfDsButton
        kind="dan"
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
    </>
  );
};

export const Home = iso(`
field Query.Home @component {
    __typename
    githubRepoStats {
      stars
    }
  }
`)(function Home({ data }) {
  const { commit } = useMutation(joinWaitlistMutation);
  // const { navigate } = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmat, setFormSubmat] = useState(false);
  const [error, setError] = useState(false);
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

  function submitWaitlistForm(value: WaitlistFormData) {
    setFormSubmitting(true);
    setError(false);

    try {
      commit(
        { name: value.name, email: value.email, company: value.company },
        {
          onError: () => {
            logger.error("Error joining waitlist");
            setError(true);
            setFormSubmitting(false);
          },
          onComplete: ({ joinWaitlist }) => {
            if (!joinWaitlist.success) {
              logger.error(joinWaitlist.message);
              setError(true);
              setFormSubmitting(false);
              return;
            }
            logger.info("Successfully joined waitlist");
            setFormSubmat(true);
            setFormSubmitting(false);
          },
        },
      );
    } catch (error) {
      logger.error("Unexpected error during form submission", error);
      setError(true);
      setFormSubmitting(false);
    }
  }

  const initialFormData = {
    name: "",
    email: "",
    company: "",
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-content flexRow gapLarge">
          <div className="flex1 flexRow alignItemsCenter">
            <div className="header-logo">
              <BfLogo
                boltColor="var(--text)"
                foundryColor="var(--text)"
                height={24}
              />
            </div>
          </div>
          <div className="mobile-hide">
            <nav className="alignItemsCenter flexRow gapLarge header-nav">
              <NavButtons />
            </nav>
          </div>
          <nav className="mobile-show">
            <BfDsButton
              kind="dan"
              iconLeft="menu"
              onClick={() => {
                setShowMenu(true);
              }}
            />
          </nav>
          {showMenu && (
            <div className="mobile-show">
              <div className="flexColumn gapLarge sidebar-nav">
                <div className="selfAlignEnd">
                  <BfDsButton
                    kind="dan"
                    iconLeft="cross"
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  />
                </div>
                <NavButtons />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section flexColumn" ref={heroRef}>
        <div className="landing-content">
          <div className="hero-content">
            {/* Github button */}
            <BfDsButton
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
            <div className="substack-form">
              <div style={{ marginBottom: 12 }}>
                We're happy to have you here.
              </div>
              {formSubmat
                ? (
                  <div>
                    <h3>Thanks for joining the waitlist!</h3>
                    We'll be in touch soon.
                    <div style={{ marginTop: 12 }}>
                      <BfDsButton
                        kind="dan"
                        iconLeft="arrowUp"
                        text="Back to top"
                        onClick={scrollToTop}
                      />
                    </div>
                  </div>
                )
                : (
                  <BfDsForm
                    testId="waitlist-form"
                    initialData={initialFormData}
                    onSubmit={submitWaitlistForm}
                    xstyle={{
                      display: "flex",
                      gap: 8,
                      flexDirection: "column",
                    }}
                  >
                    <BfDsFormTextInput id="name" title="What is your name?" />
                    <BfDsFormTextInput id="email" title="What is your email?" />
                    <BfDsFormTextInput
                      id="company"
                      title="Where do you work?"
                    />
                    <BfDsFormSubmitButton
                      testId="waitlist-submit"
                      disabled={formSubmitting}
                      text="Submit"
                      showSpinner={formSubmitting}
                    />
                    {error && (
                      <div>
                        <h3>Oops!</h3>
                        There was an error... email{" "}
                        <a href="mailto:dan@boltfoundry.com">Dan</a>{" "}
                        and we'll get in touch.
                      </div>
                    )}
                  </BfDsForm>
                )}
            </div>
          </div>
        </div>
        <div className="landing-footer">
          <div className="landing-content flexRow gapMedium alignItemsCenter">
            <div className="flex1">
              &copy; 2025 Bolt Foundry. All rights reserved.
            </div>
            <BfDsButton
              size="medium"
              kind="danDim"
              iconLeft="brand-discord"
              href="https://discord.gg/tU5ksTBfEj"
              hrefTarget="_blank"
            />
            <BfDsButton
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
