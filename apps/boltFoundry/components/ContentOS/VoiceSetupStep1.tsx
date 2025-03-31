import { useState } from "react";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsInput } from "apps/bfDs/components/BfDsInput.tsx";

type Props = {
  handleSubmit: (submat: boolean) => void;
};

export function VoiceSetupStep1({ handleSubmit }: Props) {
  const [voiceLinks, setVoiceLinks] = useState<Array<string | null>>([null]);
  return (
    <>
      <h2 className="voice-section-header">
        Let's find your voice
      </h2>
      <div className="voice-section-text">
        Paste up to five links in the fields below to examples of content that
        match your desired voice. These can be links to posts you’ve written, or
        just posts or social feeds of writers you like.
      </div>
      {voiceLinks.map((link, index) => (
        <BfDsInput
          autoFocus={index === voiceLinks.length - 1}
          key={index}
          label={index === 0
            ? `Source link${voiceLinks.length > 1 ? "s" : ""}`
            : undefined}
          placeholder="https://my.blog.com/"
          value={link ?? ""}
          onChange={(e) => {
            const updatedVoiceLinks = [...voiceLinks];
            updatedVoiceLinks[index] = e.target.value;
            setVoiceLinks(updatedVoiceLinks);
          }}
        />
      ))}
      <BfDsButton
        kind="overlay"
        iconLeft="plus"
        text="Add another source"
        xstyle={{ alignSelf: "flex-start" }}
        onClick={() => {
          setVoiceLinks([...voiceLinks, ""]);
        }}
      />
      <BfDsButton
        kind="primary"
        type="submit"
        text="Submit"
        xstyle={{ alignSelf: "flex-end" }}
        onClick={() => handleSubmit(true)}
      />
    </>
  );
}
