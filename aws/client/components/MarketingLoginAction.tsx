import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import { MarketingLoginActionQuery$data } from "aws/__generated__/MarketingLoginActionQuery.graphql.ts";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";
const { useEffect, useState } = React;
const { useLazyLoadQuery } = ReactRelay;

const query = await graphql`
  query MarketingLoginActionQuery {
    me {
      id
    }
  }`;

type Props = { setForceScroll?: (forceScroll: boolean) => void };

export default function MarketingLoginAction(
  { setForceScroll }: Props,
) {
  const enableNewSections = useFeatureFlag("landing_page_expansion");
  const enableSignup = useFeatureFlag("enable_signup");
  const data = useLazyLoadQuery(query, {}) as MarketingLoginActionQuery$data;
  const loggedIn = !!data.me && data.me.id?.startsWith("Person");

  function scrollToElement(
    className: string,
    behavior: ScrollBehavior = "smooth",
  ) {
    const element = document.querySelector(className);
    if (element) {
      element.scrollIntoView({ behavior, block: "start" });
      if (setForceScroll) {
        setForceScroll(true);
      }
    } else {
      // deno-lint-ignore no-console
      console.log(`Element with class ${className} not found`);
    }
  }
  return (
    <>
      <Button
        kind="overlay"
        text="Pricing"
        onClick={() => {
          scrollToElement(".pricing-scroll");
        }}
        testId="button-pricing-nav"
      />
      {
        /* <Button
        kind="overlay"
        text="FAQs"
        onClick={() => {
          scrollToElement(".faq-section");
        }}
        testId="button-faq-nav"
      /> */
      }
      {
        /* {enableNewSections && (
        <Button
          kind="overlay"
          text="Demo"
          onClick={() => {
            scrollToElement(".live-demo-section");
          }}
          testId="button-demo-nav"
        />
      )} */
      }
      {loggedIn
        ? (
          <Button
            kind="accent"
            link="/projects"
            text="Projects"
            testId="button-projects-nav"
          />
        )
        : (
          <>
            <Button
              kind="overlay"
              link="/login"
              text="Login"
              testId="button-login-nav"
            />
            <Button
              kind="primary"
              link="/signup"
              text={enableSignup ? "Get clips" : "Interested?"}
              type="submit"
              testId="button-signup-nav"
            />
          </>
        )}
    </>
  );
}
