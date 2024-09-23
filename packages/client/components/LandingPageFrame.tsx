import type * as React from "react";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { Link } from "packages/client/components/Link.tsx";

export function LandingPageFrame({ children }: React.PropsWithChildren<Props>) {
  return (
    <div className="landing-page-frame">
      <nav className="nav landing-page-header">
        <div className="landing-page-logo">
          <Link to="/">
            <BfLogo />
          </Link>
        </div>
        <div className="landing-page-nav">
          <Link to="/login">
            <div>Login</div>
          </Link>
          <Link to="/blog">
            <div>Blog</div>
          </Link>
          <BfDsButton
            href="https://meetings.hubspot.com/dan-sisco/bolt-foundry-demo"
            hrefTarget="blank"
            text="Let's talk"
            size="large"
          />
        </div>
      </nav>
      {children}
    </div>
  );
}
