import { React } from "deps.ts";
import { VideoPlayer } from "packages/client/components/VideoPlayer.tsx";

export default function MarketingTestimonial() {
  return (
    <div className="testimonials">
      <div className="row-column testimonial">
        <div className="testimonial-headshot">
          <VideoPlayer
            showBackground={false}
            src="https://bf-static-assets.s3.amazonaws.com/videos/testimonial_tinycupboard_matt.mp4"
            xstyle={{ borderRadius: "50%", border: "3px solid var(--accent)" }}
          />
        </div>
        <div className="testimonial-text">
          <div className="testimonial-quote">
            Now that we&apos;re working with Bolt Foundry we have enough content
            to post more than once a day if we wanted to. And that&apos;s huge.
          </div>
          <div className="testimonial-author">
            <div className="testimonial-name">Matt Rosenblum</div>
            <div className="testimonial-subname">
              Owner, <em>Tiny Cupboard</em>
            </div>
          </div>
        </div>
      </div>
      {/* Commenting out other testimonials for now */}
      {
        /* <div className="rowReverse-column testimonial">
        <div
          className="testimonial-headshot"
          style={{
            background:
              "url('https://bf-static-assets.s3.amazonaws.com/pictures/adam_broud.jpg') center/cover no-repeat",
          }}
        >
        </div>
        <div className="testimonial-text">
          <div className="testimonial-quote">
            We&apos;d spend hours editing our shows for social. Bolt Foundry cut
            the process down to minutes.
          </div>
          <div className="testimonial-author">
            <div className="testimonial-name">Adam Broud</div>
            <div className="testimonial-subname">
              Comedian & Host, <em>Comedy Church</em>
            </div>
          </div>
        </div>
      </div>
      <div className="row-column testimonial">
        <div
          className="testimonial-headshot"
          style={{
            background:
              "url('https://bf-static-assets.s3.amazonaws.com/pictures/mike_bramante.jpg') center/cover no-repeat",
          }}
        >
        </div>
        <div className="testimonial-text">
          <div className="testimonial-quote">
            Making clips is a pain, but Bolt Foundry makes it faster and easier
            than any tool I've used.
          </div>
          <div className="testimonial-author">
            <div className="testimonial-name">Mike Bramante</div>
            <div className="testimonial-subname">
              Standup Comedian
            </div>
          </div>
        </div>
      </div> */
      }
    </div>
  );
}
