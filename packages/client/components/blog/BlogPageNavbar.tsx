import { Link } from "packages/client/components/Link.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function BlogPageNavbar() {
  return (
    <div className="blog-navbar">
      <Link to="/blog">Blog</Link>
      {/* <Link to="/about">About</Link> */}
      <BfDsButton
        href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
        hrefTarget="blank"
        text="Let's talk"
        size="large"
      />
    </div>
  );
}
