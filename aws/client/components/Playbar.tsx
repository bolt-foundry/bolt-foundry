import { graphql, Maybe, React, ReactRelay } from "aws/client/deps.ts";
import {
  Playbar_project$data,
  Playbar_project$key,
} from "aws/__generated__/Playbar_project.graphql.ts";
import Tooltip, {
  TooltipJustification,
} from "aws/client/ui_components/Tooltip.tsx";

const { useFragment } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  clipBar: {
    position: "absolute",
    top: 0,
    height: 8,
    background: "var(--overlayDark)",
    borderRadius: 4,
    cursor: "pointer",
  },
  clipBarSelected: {
    background: "var(--accent)",
  },
  mainBar: {
    background: "var(--border)",
    height: 2,
    position: "absolute",
    width: "100%",
    top: 3,
    left: 0,
  },
  playBar: {
    position: "relative",
    width: "100%",
    height: 8,
  },
};

type Props = {
  project$key: Playbar_project$key;
  handleGotoClip: (id: string | null) => void;
};

const fragment = await graphql`
  fragment Playbar_project on Project {
    id
    clips(
      first: $count, 
      after: $cursor
    ) @connection(key: "ClipList_project_clips") {
      edges {
        node {
          id
          start_time
          end_time
          title
        }
      }
    }
  }
`;

export default function Playbar({ project$key, handleGotoClip }: Props) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const data = useFragment(
    fragment,
    project$key,
  ) as Playbar_project$data;

  const clips = data?.clips?.edges ?? [];

  const handleSelectedClip = (id: Maybe<string>) => {
    if (!id) return;
    if (selectedId === id) {
      setSelectedId(null);
      handleGotoClip(null);
    } else {
      setSelectedId(id);
      handleGotoClip(id);
    }
  };

  const duration = 391.302676; // TODO: get from video

  return (
    <div style={styles.playBar}>
      <div className="mainBar" style={styles.mainBar}></div>
      {clips.map((c) => {
        const clip = c?.node;
        const startTime = clip?.start_time ?? 0;
        const endTime = clip?.end_time ?? 0;
        const left = (startTime / duration) * 100;
        const width = (endTime - startTime) / duration * 100;

        const closeToEnd = left + width > 90;
        const closeToStart = left < 10;
        let justification = "center" as TooltipJustification;
        if (closeToEnd) {
          justification = "end" as TooltipJustification;
        } else if (closeToStart) {
          justification = "start" as TooltipJustification;
        }

        if (!clip) return null;
        return (
          <Tooltip
            delay={0}
            text={clip.title ?? ""}
            position="bottom"
            justification={justification}
          >
            <div
              className="clipBar"
              key={clip.id}
              onClick={() => handleSelectedClip(clip.id)}
              style={{
                ...styles.clipBar,
                ...(selectedId === clip.id && styles.clipBarSelected),
                left: `${left}%`,
                width: `${width}%`,
              }}
            >
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
