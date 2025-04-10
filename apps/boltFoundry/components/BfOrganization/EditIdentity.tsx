import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsInput } from "apps/bfDs/components/BfDsInput.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { useState } from "react";
import { classnames } from "lib/classnames.ts";
import { BfDsTextArea } from "apps/bfDs/components/BfDsTextArea.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
const logger = getLogger(import.meta);

export const EditIdentity = iso(`
  field BfOrganization_Identity.EditIdentity @component {
    voice {
      voiceSummary
      voice
    }
  }
`)(function EditIdentity({ data }) {
  const { navigate } = useRouter();
  const [showChanges, setShowChanges] = useState(false);
  const [voiceLinks, setVoiceLinks] = useState<string[]>([]);
  const enableChanges = false;
  const sectionClasses = classnames([
    "voice-section-voice-style",
    {
      highlight: !showChanges,
    },
  ]);

  return (
    <>
      <h2 className="voice-section-header">
        How does this look?
      </h2>
      <div className={sectionClasses}>
        {data.voice?.voice ?? ""}
      </div>
      {!showChanges &&
        (
          <div className="flexRow spaceBetween gapMedium">
            {enableChanges && (
              <BfDsButton
                kind="outline"
                text="Make Changes"
                onClick={() => {
                  setShowChanges(true);
                }}
                xstyle={{ alignSelf: "flex-end" }}
              />
            )}
            <BfDsButton
              kind="primary"
              type="submit"
              text="Looks Good"
              onClick={() => {
                navigate("/formatter/editor");
              }}
              xstyle={{ alignSelf: "flex-end" }}
            />
          </div>
        )}
      {showChanges &&
        (
          <>
            <div>
              Tell us more about what you’re looking for, and then paste
              additional links and resubmit below.
            </div>
            <BfDsTextArea
              placeholder="What would you change?"
              onChange={() => (logger.info("foo"))}
              value=""
            />
            {voiceLinks.map((link, index) => (
              <BfDsInput
                autoFocus={index === voiceLinks.length - 1}
                key={index}
                label={index === 0
                  ? `Twitter handle${voiceLinks.length > 1 ? "s" : ""}`
                  : undefined}
                placeholder="@George_LeVitre"
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
            <div className="flexRow spaceBetween gapMedium">
              <BfDsButton
                kind="outline"
                text="Use the first version"
                onClick={() => {
                  setShowChanges(true);
                }}
              />
              <BfDsButton
                kind="primary"
                type="submit"
                text="Submit changes"
              />
            </div>
          </>
        )}
    </>
  );
});
