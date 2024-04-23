import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";

export function MarketingCallToAction() {
  return (
    <div className="marketing-cta">
      <div className="marketing-title">Reach out!</div>
      <div className="marketing-text">
        Contact us for a live demo or to learn more about Bolt Foundry.
        {" "}
        <br />
        You can also opt in to test new features on special beta-tier
        pricing.
      </div>
      <Button
        text="Contact us!"
        type="submit"
        size="xlarge"
        role="Contact us!"
        onClick={() => {}} //setCurrentModal(<ContactUs />)}
        testId="button-contact-us"
      />
    </div>
  )
}