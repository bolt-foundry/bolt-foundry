import { React } from "deps.ts";

export function LandingPageTestimonials() {
  return (
    <div className="landing-page-testimonial-section">
      <div className="landing-page-title landing-page-testimonial-title">
        Why people like us
      </div>
      <div className="flexRow flexCenter">
        <iframe
          className="landing-page-testimonial-video"
          src="https://www.youtube.com/embed/2UtVDS9YIZ0?si=RfeJTTYiGfdYtpkm"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        >
        </iframe>
      </div>
    </div>
  );
}
