import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BlogCTA } from "packages/client/components/blog/BlogCta.tsx";

export function BlogCta() {
  return (
    <div className="blog-page-cta">
      <div className="blog-page-cta-text-area">
        It's your content, get the most from it.
        <div className="blog-page-cta-cta">
          Schedule to see how Bolt Foundry can help!
        </div>
      </div>
      <div className="blog-page-lets-talk-button">
        <BfDsButton
          href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
          hrefTarget="blank"
          text="Let's talk"
          size="xlarge"
        />
      </div>
    </div>
  );
}
