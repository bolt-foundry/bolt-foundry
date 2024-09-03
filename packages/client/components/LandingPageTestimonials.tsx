import { React } from "deps.ts";
import { videoPlaceholderStyle } from "packages/client/pages/LandingPage.tsx";

export function LandingPageTestimonials() {
  return (
    <div style={{width: "80%"}}>
      <div className="marketing-title" style={{textAlign: "center", marginBottom: "12px"}}>Testimonials</div>
      <div style={{...videoPlaceholderStyle, margin: "auto"}}></div>
    </div>
  );
}