import { React } from "deps.ts";
import { Clip } from "packages/client/components/clipsearch/Clip.tsx";
import { Nux } from "packages/client/components/clipsearch/Nux.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";
import { isValidJSON } from "packages/lib/jsonUtils.ts";
import { GoogleFilePicker } from "packages/client/components/clipsearch/GoogleFilePicker.tsx";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";

type Props = {
  clips$key: unknown;
  clips: string | undefined | null;
};

const fragment = await graphql`
  fragment ClipsView_bfPerson on BfPerson {
    googleAuthAccessToken
  }
`;

function GoogleAuthSection() {
  return (
    <div
      className="cs-page-section flexRow"
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <div className="flexColumn">
        <div className="cs-page-section-title">
          Google Authorization
        </div>
        <div>
          In order to download videos, you must authorize Google Drive access.
        </div>
      </div>
      <GoogleFilePicker />
    </div>
  );
}

export function ClipsView({ clips$key, clips }: Props) {
  let data = useFragment(fragment, clips$key);
  console.log(data)
  if (clips === undefined) {
    return (
      <>
        {data?.googleAuthAccessToken === null &&
          <GoogleAuthSection />}
        <Nux />
      </>
    );
  }
  if (clips === null) {
    return <FullPageSpinner />;
  }

  const parsedClips = isValidJSON(clips)
    ? JSON.parse(clips)
    : { anecdotes: [] };

  return (
    <div className="cs-clipsView">
      {data?.googleAuthAccessToken === null &&
        <GoogleAuthSection />}
      {parsedClips?.anecdotes?.map((clip) => (
        <Clip
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
          notAuthed={data.googleAuthAccessToken}
          clips$key={clips$key}
        />
      ))}
    </div>
  );
}
