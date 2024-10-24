import { Clip } from "packages/client/components/clipsearch/Clip.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { isValidJSON } from "packages/lib/jsonUtils.ts";
import { GoogleFilePicker } from "packages/client/components/clipsearch/GoogleFilePicker.tsx";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { useClipSearchState } from "packages/client/contexts/ClipSearchContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsCallout } from "packages/bfDs/BfDsCallout.tsx";
import { ClipsViewGlimmer } from "packages/client/components/clipsearch/ClipsViewGlimmer.tsx";

type Props = {
  count: number;
  clips$key: unknown;
};

const fragment = await graphql`
  fragment ClipsView_bfPerson on BfPerson {
    googleAuthAccessToken
  }
`;

function GoogleAuthSection() {
  return (
    <BfDsCallout
      kind="warning"
      header="Google authorization"
      body="In order to download videos, you must authorize Google Drive access."
      action={<GoogleFilePicker />}
    />
  );
}

export function ClipsView({ count, clips$key }: Props) {
  const {
    clips,
    clipsCount,
    clearSearch,
    commitSearch,
    prompt,
    previousPrompt,
  } = useClipSearchState();
  const data = useFragment(fragment, clips$key);
  if (clips === undefined) {
    return (
      <>
        {data?.googleAuthAccessToken == null &&
          <GoogleAuthSection />}
      </>
    );
  }
  const italicPrompt = (text: string = previousPrompt) => {
    return (
      <span style={{ fontStyle: "italic" }}>
        {text}
      </span>
    );
  };
  if (clips === null) {
    return (
      <div className="flexColumn" style={{ gap: "20px" }}>
        <div className="cs-page-hero-callout">
          Searching {count} videos for "{italicPrompt(prompt)}".
        </div>
        <ClipsViewGlimmer />
      </div>
    );
  }

  const parsedClips = isValidJSON(clips)
    ? JSON.parse(clips)
    : { anecdotes: [] };

  if (parsedClips.anecdotes == null || parsedClips.anecdotes.length === 0) {
    return (
      <div className="flexColumn" style={{ gap: "20px" }}>
        <div className="cs-page-hero-callout">
          No clips found for "{italicPrompt()}".{" "}
          <a onClick={() => commitSearch(previousPrompt)}>Retry</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-clipsView">
      {data?.googleAuthAccessToken == null &&
        <GoogleAuthSection />}
      <div
        className="cs-page-section-outside-header flexRow"
        style={{ alignItems: "center", gap: 8 }}
      >
        <div className="cs-page-section-title" style={{ flex: 1 }}>
          Search results for "{italicPrompt()}"
        </div>
        <div>
          {clipsCount} clips found in {count} videos
        </div>
        <div>
          <BfDsButton
            kind="secondary"
            iconLeft="cross"
            onClick={clearSearch}
            tooltip="Clear search"
          />
        </div>
      </div>
      {parsedClips?.anecdotes?.map((clip, index: number) => (
        <Clip
          key={index}
          titleText={clip.titleText}
          text={clip.text}
          descriptionText={clip.descriptionText}
          rationale={clip.rationale}
          filename={clip.filename}
          topics={clip.topics}
          confidence={clip.confidence}
          mediaId={clip.mediaId}
          transcriptId={clip.transcriptId}
          startIndex={clip.startIndex}
          endIndex={clip.endIndex}
          startTime={clip.startTime}
          endTime={clip.endTime}
          clips$key={clips$key}
        />
      ))}
    </div>
  );
}
