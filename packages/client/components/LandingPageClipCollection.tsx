import { React } from "deps.ts";

export function LandingPageClipCollection() {
  return (
    <div className="landing-page-clips-container">
      <div id="clips-column-one">
        <div className="landing-page-clips" id="clip1"></div>
        <div className="landing-page-clips" id="clip2"></div>
      </div>
      <div id="clips-column-two">
        <div className="landing-page-clips" id="clip3"></div>
      </div>
    </div>
  );
}
