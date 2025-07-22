import { iso } from "@iso-bfc";

import { useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsCopyButton } from "@bfmono/apps/bfDs/components/BfDsCopyButton.tsx";
import { useMutation } from "@bfmono/apps/boltfoundry-com/hooks/isographPrototypes/useMutation.tsx";
import joinWaitlistMutation from "@bfmono/apps/boltfoundry-com/__generated__/__isograph/Mutation/JoinWaitlist/entrypoint.ts";

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { BfDsFormSubmitButton } from "@bfmono/apps/bfDs/components/BfDsFormSubmitButton.tsx";
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
            <BfDsButton
              variant="ghost"
              icon="brand-github"
              href="https://github.com/bolt-foundry/bolt-foundry"
              target="_blank"
            >
              {data?.githubRepoStats?.stars.toString() ?? "--"}
            </BfDsButton>
            <h1 className="main hero-headline">
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
                <BfDsCopyButton
                  aria-label="Copy npm command"
                  textToCopy={bfCode}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="more-content flexCenter flexColumn mobile-hide">
          <BfDsButton
            variant="ghost"
            icon="arrowDown"
            iconOnly
            onClick={scrollToSubstack}
          />
        </div>
      </main>

      {/* Substack Subscription */}
      <section className="substack-section" ref={substackRef}>
        <div className="landing-content">
          <div className="substack-container">
            <h2 className="main substack-title">Stay updated</h2>
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
                        variant="primary"
                        icon="arrowUp"
                        onClick={scrollToTop}
                      >
                        Back to top
                      </BfDsButton>
                    </div>
                  </div>
                )
                : (
                  <BfDsForm
                    testId="waitlist-form"
                    initialData={initialFormData}
                    onSubmit={submitWaitlistForm}
                    className="waitlist-form-container"
                  >
                    <BfDsInput name="name" label="What is your name?" />
                    <BfDsInput name="email" label="What is your email?" />
                    <BfDsInput
                      name="company"
                      label="Where do you work?"
                    />
                    <BfDsFormSubmitButton
                      disabled={formSubmitting}
                      text="Submit"
                      spinner={formSubmitting}
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
      </section>
    </div>
  );
});
