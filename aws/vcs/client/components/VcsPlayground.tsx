import { React } from "aws/client/deps.ts";
import PageFrame from "aws/client/components/PageFrame.tsx";
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
  const [text, setText] = useState<string>("Hiyeee");
  const [url, setUrl] = useState(
    "https://boltfoundry-mediaingestionbucket66a2684a-11gonqshwgqpd.s3.dualstack.us-east-1.amazonaws.com/9a9a5283d4114b83b3d53a2ea8833582.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIASRZPKY6MVBCSMIUK%2F20231013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231013T205738Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLWVhc3QtMSJGMEQCIEC7bQTYW1BZoNPKIt%2Bu3GO%2Bk3WVE7o44MqBPOu1uzSaAiAOCpKsujiwwB4E2fUqDCD%2Be%2BlKn6e1bYnFJFy41y9T%2ByqzAwg2EAAaDDE3NTY1NjA2MDgyNSIMR%2BRMgIiVmn7d%2FFxFKpADzvextcWWsnbKlGwZdOGbMFCIAOS%2FAcsuSuvt0ngkTTAQ7NV0T7NEV2p1irLAcK23UMjuDznt2gFspDL%2Fl%2BYOVnOnYrVJWV2P5f%2B%2FNbUZeAwj0iWNbu4CYL1yMyDbU73H3mQD1yc6jjYCVcZvNFsGQSTbtaI8N7Gg2ChBMEG7wY8oovaWo14OizghNaLzNYoiWqK19h%2FOglkPq1Isu79KZVmqJVV%2Foit7dF7jH4B3LNHsJGqWmp9J4cHpMkXH1OzOiHNzU5ofJrEAaa9tDl1r4z%2FlSgdnhmS5T9OZKaMv0bhtsEi3Lj528xT8RvwNwiiYPbDAGHXnhiy4d3NfAgi5FZZcZkWABtlrL0Y2LbuKG3vZZg3S071gbtdbqL0PSV2r%2Fr2kZhQcIwTyW%2FGuv8krJmrwPC0lYI6ewOauEv4XyAKAkFWAY8zQl7IxLojt89WlnpuOp6c%2BhSLPLhf4IMYO9RDlq2ZgX5QF6Kx%2FdrwEG7vPMBs7FsZ3hKKMBRNvIAE%2FuQcXXu8uuRjZSp0vWwf3PDC43qapBjqfAYO3RGZO8YXXLkcRarUm1OaB9Rjprcce1ZqLI0usTNxpCG6NjkbIdPBhzhjBnHBeKxDE8Juvo2JjkLm2lZd65vXXNKRCHZgxXa5sj4967SEBdsl%2FIq2wFLSyqKSINoj4bk4LXClVWZjrbXQz51iy7n1%2FjJydB%2FTyeBP%2BPDeZffoCUfNopkQCFXIObpgknUsvn9s91keZRNBJ7WxTXmU4Dg%3D%3D&X-Amz-Signature=11df6e07c47af699f79f4ac69b033b4dade1e516c5a0448082811262d2dd255b",
  );
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (comp) {
      const api = comp.startDOMOutputAsync(canvasRef.current, 640, 360, {
        videoSlots: [{
          id: "first",
          videoElement: videoRef.current,
        }],
        assetImages: [],
      }, { getAssetUrlCb });
      api.then((api) => {
        api.setParamValue("demoText", text);
        apiRef.current = api;
      });
    }
    // const interval = setInterval(() => {
    //   const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${
    //     Math.floor(Math.random() * 256)
    //   }, ${Math.floor(Math.random() * 256)})`;
    //   setColor(randomColor);
    //   context.fillStyle = randomColor;
    //   context.fillRect(0, 0, canvas!.width, canvas!.height);
    // }, 250);

    // return () => clearInterval(interval);
  }, [url]);

  useEffect(() => {
    const api = apiRef.current;
    if (api) {
      api.setParamValue("demoText", text);
    }
  }, [text]);

  return (
    <>
      <div ref={canvasRef} style={{ width: 640, height: 360 }}></div>
      title:{" "}
      <input value={text} onChange={(e) => setText(e.currentTarget.value)} />
      video url:{" "}
      <input value={url} onChange={(e) => setUrl(e.currentTarget.value)} />
      <video autoPlay={true} muted={true} ref={videoRef} src={url} />
    </>
  );
};

export default () => {
  return (
    <PageFrame xstyle={{ overflowY: "auto", flex: "auto" }}>
      <VcsPlayground />
    </PageFrame>
  );
};
