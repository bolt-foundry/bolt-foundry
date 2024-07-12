import { React } from "deps.ts";
import Input from "/aws/client/ui_components/Input.tsx";
import Button from "/aws/client/ui_components/Button.tsx";
import { ActionType } from "/aws/client/hooks/useClipEditData.tsx";
const { useState } = React;
export function StickerMenu(
  { handleClose, startingImageWord, endingImageWord },
) {
  const [inputValue, setInputValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [localImageUrl, setLocalImageUrl] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const clearInput = () => {
    setInputValue("");
    setImageUrl("");
    setLocalImageUrl("");
  };

  const fetchImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setLocalImageUrl(localUrl);
      handleDispatchAction(ActionType.SET_STICKER_URL, localUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setImageUrl(inputValue);
    fetchImage(inputValue);
  };

  return (
    <div className="cropMenuModal" style={{ flexDirection: "column" }}>
      <div>
        Image on screen starting at timecode: "{startingImageWord.start}" and
        ending at timecode: "{endingImageWord.end}"
      </div>
      <div>Find an image from google images</div>
      <form onSubmit={handleSubmit}>
        <Input
          readonly={false}
          type="text"
          name="imageUrl"
          value={inputValue}
          placeholder="Enter image URL"
          onChange={handleInputChange}
        />
        <Button
          kind="overlay"
          text="clear"
          onClick={clearInput}
        />
        <Button type="submit" text="submit"></Button>
        {localImageUrl && (
          <div style={{ flex: 1 }}>
            <img src={localImageUrl} alt="image" style={{ width: "100%" }} />
          </div>
        )}
      </form>
      <Button
        kind="overlay"
        type="reset"
        text="close"
        onClick={handleClose}
      />
    </div>
  );
}
