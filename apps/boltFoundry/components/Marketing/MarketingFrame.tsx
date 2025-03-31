import type * as React from "react";
import { RouterLink } from "apps/boltFoundry/components/Router/RouterLink.tsx";
import { CfLogo } from "apps/boltFoundry/resources/CfLogo.tsx";

export function MarketingFrame({ children }: React.PropsWithChildren) {
  return (
    <div className="landing-page-frame">
      <nav className="landing-page-header">
        <div className="landing-page-logo">
          <RouterLink to="/">
            <CfLogo />
          </RouterLink>
        </div>
        <div className="landing-page-nav">
        </div>
      </nav>
      {children}
    </div>
  );
}
