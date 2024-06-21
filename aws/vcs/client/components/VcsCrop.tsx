import { React } from "aws/client/deps.ts";
import PageFrame from "aws/client/components/PageFrame.tsx";
import BFRenderer from "aws/client/lib/BFRenderer.ts";
// deno-lint-ignore no-console
const log = console.log;

let comp;
function getAssetUrlCb(assetName: string) {
  log("goes around", assetName);
  return `https://bf-static-assets.s3.amazonaws.com/fonts/${assetName}`;
}
if (typeof Deno === "undefined") {
  comp = await import(
    "aws/client/static/vcs/dev_bf.bundle.js"
  );
}
const { useState, useEffect, useRef } = React;
const VcsPlayground = () => {
  const [running, setRunning] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    "https://bf-static-assets.s3.amazonaws.com/test-files/bf+dance+party.mp4",
  );
  const [startTimecode, setStartTimecode] = useState(10);
  const [endTimecode, setEndTimecode] = useState(20);
  const [height, setHeight] = useState(1920);
  const [width, setWidth] = useState(1080);
  const bfOutput = useRef(null);
  function toggleRunning() {
    setRunning(!running);
  }
  useEffect(() => {
    let interval;
    if (running && bfOutput.current) {
      const fps = 30;
      // @ts-expect-error #techdebt
      const bfRenderer = new BFRenderer({
        height,
        width,
        startTimecode,
        endTimecode,
        rootElement: bfOutput.current,
        videoUrl,
        fps,
      });
      // @ts-expect-error #techdebt
      bfRenderer.startOnlineRender().then(() => {
        setRunning(false);
      });
    }
  }, [running]);

  return (
    <div>
      {running === false && (
        <>
          <button onClick={() => setRunning(true)}>
            Start encode
          </button>
          in time:{" "}
          <input
            value={startTimecode}
            onChange={(e) => setStartTimecode(parseFloat(e.target.value))}
          />
          out time:{" "}
          <input
            value={endTimecode}
            onChange={(e) => setEndTimecode(parseFloat(e.target.value))}
          />
          height:{" "}
          <input
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
          />
          width:{" "}
          <input
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
          />
          videoUrl:{" "}
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </>
      )}
      {running === true && (
        <button disabled>
          Encoding...
        </button>
      )}

      <div ref={bfOutput} style={{ width: "20vw" }} />
    </div>
  );
};

export default () => {
  return (
    <PageFrame xstyle={{ overflowY: "auto", flex: "auto" }}>
      <VcsPlayground />
    </PageFrame>
  );
};
