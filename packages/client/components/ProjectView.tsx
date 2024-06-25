import { React, ReactRelay } from "deps.ts";
import { ClipListNull } from "packages/client/components/ClipListNull.tsx";
import { ClipList } from "packages/client/components/ClipList.tsx";

import { DeleteProjectButton } from "packages/client/components/DeleteProjectButton.tsx";
import { classnames } from "lib/classnames.ts";
import { ProjectTitle } from "packages/client/components/ProjectTitle.tsx";
import { SettingsProjectSidebar } from "packages/client/components/SettingsProjectSidebar.tsx";
import { graphql } from "packages/client/deps.ts";

const { useState } = React;
const { useFragment } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  stat: {
    display: "flex",
    flexDirection: "row",
    gap: "0.4ch",
  },
  statBold: {
    fontWeight: "bold",
  },
  meta: {
    color: "var(--textSecondary)",
    fontSize: 14,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  titleMobile: {
    color: "var(--text)",
    wordBreak: "break-word",
    fontWeight: "bold",
  },
};

type Props = {
  containerProject$key: ProjectView_containerProject$key;
}
export function ProjectView(
  { containerProject$key }: Props,
) {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(
    null,
  );
  const data = useFragment(
    fragment,
    containerProject$key,
  );

  console.log(data);

  if (!data) return <div>Missing project data</div>;

  const clips = data?.clips?.edges ?? [];

  const handleGotoClip = (clipId: string | null) => {
    setSelectedClipId(clipId);
  };

  const showPlaybar = false;

  let displayRatio = "wide";
  if (data?.ratio === 9 / 16) {
    displayRatio = "tall";
  }
  const videoClasses = classnames([
    "videoPlayer",
    displayRatio,
  ]);

  return (
    <div className="flexRow">
      <div className="page" style={{ overflowY: "auto", height: "100vh" }}>
        <div className="mobile-hide">
          <div className="header flexRow flexCenter" style={{ gap: 26 }}>
            <div className={videoClasses}>
              {/* <VideoPlayer
                src={videoSrcCache ?? data.opurl ?? data.videoUrl}
                xstyle={{ borderRadius: 8 }}
                playerLocation="projectView"
              /> */}
            </div>
            <div style={{ flex: 1 }}>
              <ProjectTitle project$key={data} />
              <div className="headerSubtext">{data.name} {data.opurl}</div>
              {
                /* <div style={styles.meta}>
            <div style={styles.stat}>
              <div style={styles.statBold}>{clips.length}</div>
              <div>clips</div>
            </div>
          </div> */
              }
              {/* {showPlaybar && (
                <Playbar project$key={data} handleGotoClip={handleGotoClip} />
              )} */}
            </div>
            <DeleteProjectButton
              projectId={data.id}
              testId="delete-project-header"
            />
          </div>
        </div>
        <div className="mobile-show">
          <div className="header">
            <div style={styles.text}>
              <div style={styles.titleMobile}>{data.name}</div>
              {/* <div style={styles.subtitle}>{data.originalFilename}</div> */}
              {
                /* <div style={styles.meta}>
            <div style={styles.stat}>
              <div style={styles.statBold}>{clips.length}</div>
              <div>clips</div>
            </div>
          </div> */
              }
            </div>
            <DeleteProjectButton projectId={data.id} />
          </div>
        </div>

        {clips.length > 0
          ? (
            <ClipList
              project$key={data}
              gotoClip={selectedClipId}
              /* videoSrc={videoSrcCache ?? data?.opurl ?? data?.videoUrl ?? ""} */
            />
          )
          : <ClipListNull />}
      </div>
      <div className="mobile-hide settingsSidebar">
        <SettingsProjectSidebar key={data?.id} project$key={data} />
      </div>
    </div>
  );
}
