import { React } from "deps.ts";
import Icon from "packages/bfDs/Icon.tsx";

const igVideos = [
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
    caption: "Condom anxiety w/ @joesnotjoking #comedy #standupcomedy #funny",
    likes: 38,
    comments: 0,
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
  {
    account: "blueridgecomedy",
    igHash: "C4xojmrq3VT",
  },
];

export function MarketingIGHscroll() {
  const [playingVideoRefIndex, setPlayingVideoRefIndex] = React.useState(-1);
  const videoRefs = igVideos.map(() => {
    return React.createRef<HTMLVideoElement>();
  });
  return (
    <div className="cta-section marketing-hscroll">
      <div className="hscroll-content">
        {igVideos.map((video, index) => {
          return (
            <div className="hscroll-video" key={index}>
              <video
                ref={videoRefs[index]}
                src={`https://bf-static-assets.s3.amazonaws.com/ig/${video.account}_${video.igHash}.mp4`}
              >
                Your browser does not support the video tag.
              </video>
              <div className="hscroll-video-overlay">
                <div className="hscroll-reels">Reels</div>
                <div className="hscroll-ig">
                  <Icon name="brand-instagram" color="white" />
                </div>
                <div className="hscroll-camera"></div>
                <div className="hscroll-post">
                  <div className="hscroll-post-author">
                    <div
                      className="hscroll-post-picture"
                      style={{
                        background:
                          `url('https://bf-static-assets.s3.amazonaws.com/ig/${video.account}.jpg') center/cover no-repeat`,
                      }}
                    />
                    <div className="hscroll-post-username">
                      @{video.account}
                    </div>
                  </div>
                  <div className="hscroll-post-text">
                    {video.caption ?? ""}
                  </div>
                </div>
                <div className="hscroll-chrome">
                  <div className="hscroll-chrome-likes">
                    {video.likes ?? 0}
                  </div>
                  <div className="hscroll-chrome-comments">
                    {video.comments ?? 0}
                  </div>
                  <div className="hscroll-chrome-share" />
                  <div className="hscroll-chrome-kebab" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
