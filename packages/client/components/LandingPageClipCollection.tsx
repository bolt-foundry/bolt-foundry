import { React } from "deps.ts";

export function LandingPageClipCollection() {
  return (
    <div className="landing-page-clips-container">
      <div id="clips-column-one">
        <video controls className="landing-page-clips" id="clip1">
          <source src="../../../resources/media/Working with rodger testimonial_v1.mp4" type="video/mp4" />
        </video>
        <video controls className="landing-page-clips" id="clip2">
          <source src="resources/media/Why GRIP6 wallet verified testimonial April 24 9x16_v1.mov" type="video/mp4" />
        </video>
      </div>
      <div id="clips-column-two">
        <video controls className="landing-page-clips" id="clip3">
          <source src="resources/media/10_pattern_pxm_success_story.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
