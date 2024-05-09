import { project as fakeData } from "packages/client/fakeData/ProjectPageOldQuery.js";
import { React, ReactRelay } from "deps.ts";
import { ClipListNull } from "packages/client/components/ClipListNull.tsx";
import { ClipList } from "packages/client/components/ClipList.tsx";
import { VideoPlayer } from "packages/client/components/VideoPlayer.tsx";
// import {
//   ProjectView_project$data,
//   ProjectView_project$key,
// } from "packages/__generated__/ProjectView_project.graphql.ts";
import { Playbar } from "packages/client/components/Playbar.tsx";
import usePrevious from "packages/client/hooks/usePrevious.ts";
import { DeleteProjectButton } from "packages/client/components/DeleteProjectButton.tsx";
import { classnames } from "lib/classnames.ts";
import { ProjectTitle } from "packages/client/components/ProjectTitle.tsx";
import { SettingsProjectSidebar } from "packages/client/components/SettingsProjectSidebar.tsx";

const { useEffect, useState } = React;
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

// const fragment = await graphql`
//   fragment ProjectView_project on Project {
//     ...ClipList_project
//     ...Playbar_project
//     ...ProjectTitle_project
//     ...SettingsProjectSidebarQuery_project
//     id
//     name
//     ratio
//     opurl
//     clips(
//       first: $count,
//       after: $cursor
//     ) @connection(key: "ClipList_project_clips") {
//       edges {
//         node {
//           __typename
//         }
//       }
//       pageInfo {
//         endCursor
//         hasNextPage
//         hasPreviousPage
//         startCursor
//       }
//     }
//     videoUrl
//   }
// `;

export function ProjectView(
  { project$key }: { project$key: ProjectView_project$key },
) {
  const [selectedClipId, setSelectedClipId] = useState<string | null>(
    null,
  );
  const [isTrueClient, setIsTrueClient] = useState<boolean>(false);
  // const data = useFragment(
  //   fragment,
  //   project$key,
  // ) as ProjectView_project$data;
  const data = fakeData.data.project;
  const previousProjectId = usePrevious(data.id);
  // @ts-expect-error #techdebt
  const [videoSrcCache, setVideoSrcCache] = useState<string | null>(data.opurl);

  // set videoSrcCache when data.videoUrl is available
  // this is needed because the videoUrl changes with every fetch
  useEffect(() => {
    if (previousProjectId !== data.id) {
      // @ts-expect-error #techdebt
      setVideoSrcCache(data.opurl ?? data.videoUrl);
    }
  }, [data.opurl, data.videoUrl, data.id, previousProjectId]);

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
              <VideoPlayer
                src={videoSrcCache ?? data.opurl ?? data.videoUrl}
                xstyle={{ borderRadius: 8 }}
                playerLocation="projectView"
              />
            </div>
            <div style={{ flex: 1 }}>
              <ProjectTitle project$key={data} />
              {/* <div className="headerSubtext">{data.originalFilename}</div> */}
              {
                /* <div style={styles.meta}>
            <div style={styles.stat}>
              <div style={styles.statBold}>{clips.length}</div>
              <div>clips</div>
            </div>
          </div> */
              }
              {showPlaybar && (
                <Playbar project$key={data} handleGotoClip={handleGotoClip} />
              )}
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
              videoSrc={videoSrcCache ?? data?.opurl ?? data?.videoUrl ?? ""}
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
