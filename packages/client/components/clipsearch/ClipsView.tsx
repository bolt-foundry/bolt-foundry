import { React } from "deps.ts";
import { Clip } from "packages/client/components/clipsearch/Clip.tsx";
import { Nux } from "packages/client/components/clipsearch/Nux.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";
const fakeData = await import(
  "packages/client/components/clipsearch/fakeData/aiResponse.json",
  {
    assert: { type: "json" },
  }
);

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

  const parsedClips = JSON.parse(clips);

  return (
    <div className="cs-clipsView">
      {parsedClips.map((clip) => (
        <Clip
          title={clip.title}
          text={clip.text}
          description={clip.description}
          rationale={clip.rationale}
          filename={clip.filename}
          topics={clip.topics}
          confidence={clip.confidence}
        />
      ))}
    </div>
  );
}
