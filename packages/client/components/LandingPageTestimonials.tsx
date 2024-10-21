import type { React } from "packages/logger/logger.ts";

export function LandingPageTestimonials() {
  return (
    <div className="landing-page-testimonial-section">
      <div className="landing-page-title landing-page-testimonial-title">
        Why people like us
      </div>
      <div className="flexRow flexCenter">
        <iframe
          className="landing-page-testimonial-video"
          src="https://www.youtube.com/embed/2UtVDS9YIZ0?si=RfeJTTYiGfdYtpkm&rel=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        >
        </iframe>
      </div>
    </div>
  );
}
