import type * as React from "react";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { ComingSoonHero } from "packages/client/components/ComingSoonHero.tsx";
import { MarketingCallToAction } from "packages/client/components/MarketingCallToAction.tsx";

export function ComingSoonPage(): React.ReactElement {
  return (
    <MarketingFrame
      showLoginLink={false}
      showFooter={true}
    >
      <div className="header-section">
        <ComingSoonHero />
      </div>
      <MarketingCallToAction />
    </MarketingFrame>
  );
}
