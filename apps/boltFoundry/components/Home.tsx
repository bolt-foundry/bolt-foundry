import { useRef, useState } from "react";
import { iso } from "@bfmono/apps/boltFoundry/__generated__/__isograph/iso.ts";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { CfDsCopyButton } from "@bfmono/apps/cfDs/components/CfDsCopyButton.tsx";
import { useMutation } from "@bfmono/apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import joinWaitlistMutation from "@bfmono/apps/boltFoundry/__generated__/__isograph/Mutation/JoinWaitlist/entrypoint.ts";

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { CfDsForm } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsForm.tsx";
import { CfDsFormTextInput } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormTextInput.tsx";
import { CfDsFormSubmitButton } from "@bfmono/apps/cfDs/components/CfDsForm/CfDsFormSubmitButton.tsx";
import { Nav } from "@bfmono/apps/boltFoundry/components/Nav.tsx";

const logger = getLogger(import.meta);

type WaitlistFormData = {
  name: string;
  email: string;
  company: string;
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
                      <CfDsButton
                        kind="dan"
                        iconLeft="arrowUp"
                        text="Back to top"
                        onClick={scrollToTop}
                      />
                    </div>
                  </div>
                )
                : (
                  <CfDsForm
                    testId="waitlist-form"
                    initialData={initialFormData}
                    onSubmit={submitWaitlistForm}
                    xstyle={{
                      display: "flex",
                      gap: 8,
                      flexDirection: "column",
                    }}
                  >
                    <CfDsFormTextInput id="name" title="What is your name?" />
                    <CfDsFormTextInput id="email" title="What is your email?" />
                    <CfDsFormTextInput
                      id="company"
                      title="Where do you work?"
                    />
                    <CfDsFormSubmitButton
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
                  </CfDsForm>
                )}
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
