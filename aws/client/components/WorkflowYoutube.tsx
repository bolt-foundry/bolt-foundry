import { React } from "aws/client/deps.ts";
import Input from "aws/client/ui_components/Input.tsx";
import Button from "aws/client/ui_components/Button.tsx";

const { useState } = React;

const styles: Record<string, React.CSSProperties> = {
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 24,
    boxSizing: "border-box",
  },
};

export default function Youtube() {
  const [youtubeValue, setYoutubeValue] = useState<string>("");

  const handleYoutubeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeValue(e.target.value);
  };

  const uploadYoutubeVideo = () => {
    // TODO
    // deno-lint-ignore no-console
    console.log("upload this youtube video", youtubeValue);
  };

  return (
    <>
      <div>
        <h1>Upload a video from YouTube link</h1>
        <p>
          Paste a link from YouTube to get started. Please only upload videos
          you have rights to use.
        </p>
      </div>
      <div style={styles.content}>
        <Input
          value={youtubeValue}
          placeholder="Paste a youtube link"
          onChange={handleYoutubeValueChange}
        />
        <Button
          disabled={!youtubeValue}
          text={"Use this video"}
          onClick={uploadYoutubeVideo}
        />
      </div>
    </>
  );
}
