import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";

export function MarketingCallToAction() {
  const { navigate } = useRouter();
  return (
    <div className="marketing-cta">
      <div className="marketing-title">Reach out!</div>
      <div className="marketing-text">
        Contact us for pricing or to learn more about Bolt Foundry.
      </div>
      <Button
        text="Contact us!"
        type="submit"
        size="xlarge"
        role="Contact us!"
        onClick={() => navigate("/contact-us")}
        testId="button-contact-us"
      />
    </div>
  );
}
