import * as React from "react";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { ComingSoonHero } from "packages/client/components/ComingSoonHero.tsx";

export function ComingSoonPage(): React.ReactElement {

  return (
    <MarketingFrame
      showLoginLink={false}
      showFooter={true}
    >
      <div className="header-section">
        <ComingSoonHero />
      </div>
    </MarketingFrame>
  );
}
