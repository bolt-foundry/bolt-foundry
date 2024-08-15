import { React } from "deps.ts";
import { Clip } from "packages/client/components/clipsearch/Clip.tsx";
import { Nux } from "packages/client/components/clipsearch/Nux.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";
import { isValidJSON } from "packages/lib/jsonUtils.ts";

type Props = {
  clips: string | undefined | null;
};

export function ClipsView({ clips }: Props) {
  if (clips === undefined) {
    return <Nux />;
  }
  if (clips === null) {
    return <FullPageSpinner />;
  }

  const parsedClips = isValidJSON(clips)
    ? JSON.parse(clips)
    : { anecdotes: [] };

  return (
    <div className="cs-clipsView">
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
        />
      ))}
    </div>
  );
}
