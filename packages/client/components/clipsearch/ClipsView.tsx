import { React } from "deps.ts";
import { Clip } from "packages/client/components/clipsearch/Clip.tsx";
import { Nux } from "packages/client/components/clipsearch/Nux.tsx";
const fakeData = await import(
  "packages/client/components/clipsearch/fakeData/aiResponse.json",
  {
    assert: { type: "json" },
  }
);

export function ClipsView() {
  if (fakeData.default.length === 0) {
    return <Nux />;
  }

  return (
    <div className="cs-clipsView">
      {fakeData.default.map((clip) => (
        <Clip
          title={clip.title}
          text={clip.text}
          description={clip.description}
          rationale={clip.rationale}
          filename={clip.filename}
          topics={clip.topics}
          confidence={clip.confidence}
        />
      ))};
    </div>
  );
}
