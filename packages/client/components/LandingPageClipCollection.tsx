import type { React } from "deps.ts";

export function LandingPageClipCollection() {
  return (
    <div className="landing-page-clips-container">
      <div id="clips-column-one">
        <video controls className="landing-page-clips" id="clip1">
          <source
            src="https://bf-static-assets.s3.amazonaws.com/marketing/Working_with_rodger_testimonial.mp4"
            type="video/mp4"
          />
        </video>
        <video controls className="landing-page-clips" id="clip2">
          <source
            src="https://bf-static-assets.s3.amazonaws.com/marketing/Why_GRIP6_wallet_verified_testimonial.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div id="clips-column-two">
        <video controls className="landing-page-clips" id="clip3">
          <source
            src="https://bf-static-assets.s3.amazonaws.com/marketing/10_pattern_pxm_success_story.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
}
