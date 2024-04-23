import { React } from "deps.ts";

const igVideos = [
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
                src={`https://bf-static-assets.s3.amazonaws.com/videos/ig/${video.account}_${video.igHash}.mp4`}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        })}
      </div>
    </div>
  );
}
