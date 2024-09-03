import * as React from "react";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { LandingPageHero } from "packages/client/components/LandingPageHero.tsx";
import { ComingSoonHero } from "packages/client/components/ComingSoonHero.tsx";
import { MarketingCallToAction } from "packages/client/components/MarketingCallToAction.tsx";
import { LandingPageMission } from "packages/client/components/LandingPageMission.tsx";
import { LandingPageClipCollection } from "packages/client/components/LandingPageClipCollection.tsx";
import { LandingPageTestimonials } from "packages/client/components/LandingPageTestimonials.tsx"
import { LandingPageSetUpMeeting } from "packages/client/components/LandingPageSetUpMeeting.tsx";

export function LandingPage(): React.ReactElement {
  const mainContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    margin: "2vw",
    marginBottom: "10vw",
  }
  
  return (
    <MarketingFrame
      showLoginLink={false}
      showFooter={true}
    >
    <div style = {{...mainContainerStyle}}>
      <div style={blockStyle}>
        <LandingPageHero />
      </div>
      <div style={blockStyle}>
        <LandingPageClipCollection />
      </div>
    </div>
    <div style = {mainContainerStyle}>
      <div style={blockStyle}>
        <div style={videoPlaceholderStyle}></div>
      </div>
      <div style={blockStyle}>
        <LandingPageMission />
      </div>
    </div>
    <div style={{...mainContainerStyle, justifyContent: "center", alignItems: "center"}}>
      <LandingPageTestimonials />
    </div>
    <div style={{...blockStyle, backgroundColor: "rgba(11, 41, 75, 1)"}}>
      <LandingPageSetUpMeeting />
    </div>
    </MarketingFrame>
  );
}

export const blockStyle = {
  flex: "1",
  minWidth: "max(300px, 40vw)",
}

export const videoPlaceholderStyle = {
  backgroundColor: "grey", 
  paddingTop: "56.25%",
  borderRadius: "20px",
  maxWidth: "100%",
}