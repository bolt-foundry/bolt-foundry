import type * as React from "react";
import { MarketingFrame } from "@bfmono/apps/boltFoundry/components/Marketing/MarketingFrame.tsx";
import { MarketingFooter } from "@bfmono/apps/boltFoundry/components/Marketing/MarketingFooter.tsx";

export function PageMarketing(): React.ReactElement {
  const titleWords = [
    { "style": "normal", "text": "Ditch the zoom webinar," },
    { "style": "blueWord", "text": "tell your story" },
  ];

  const title = titleWords.map(({ style, text }, index: number) => {
    const styleClass = style === "normal" ? "hero-text" : "hero-text-blue";
    const space = index !== 0 ? " " : "";
    return <span key={index} className={styleClass}>{space}{text}</span>;
  });
  return (
    <MarketingFrame>
      <div className="landing-page-hero">
        <div className="landing-page-tag-line">{title}</div>
        <video
          className="landing-page-hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://bf-static-assets.s3.us-east-1.amazonaws.com/landing-page/sizzle.mp4"
            type="video/mp4"
            media="(min-width: 900px)"
          />
          <source
            src="https://bf-static-assets.s3.us-east-1.amazonaws.com/landing-page/sizzle720.mp4"
            type="video/mp4"
          />
          <img
            src="https://bf-static-assets.s3.us-east-1.amazonaws.com/landing-page/sizzle-fallback.jpg"
            alt="Sizzle BF logo"
          />
        </video>
        <div className="landing-page-hero-gradient" />
        <div className="landing-page-hero-text">
          Fuel your top of funnel with video content that clicks.
        </div>
      </div>
      {/* <ContactUs /> */}
      <MarketingFooter />
    </MarketingFrame>
  );
}
