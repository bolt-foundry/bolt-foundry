import { React, ReactRelay } from "aws/client/deps.ts";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import { colors, fonts } from "aws/client/ui_components/ui_const.tsx";
import Step from "aws/client/components/Step.tsx";
import FileUpload from "aws/client/components/FileUpload.tsx";
import Tabs, { Tab } from "aws/client/ui_components/Tabs.tsx";
import WorkflowYoutube from "aws/client/components/WorkflowYoutube.tsx";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";

// import { WorkflowQuery$data } from "aws/__generated__/WorkflowQuery.graphql.ts";

const { useEffect, useState } = React;
// const { useLazyLoadQuery } = ReactRelay;

type Props = {
  clipsLength: number;
  transcriptLength: number;
  uploaded: boolean;
  projectId: string | null;
  setProjectId: (projectId: string) => void;
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 600,
    maxWidth: "100%",
    background: colors.background,
    borderRadius: 8,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 24,
    boxSizing: "border-box",
  },
  page: {
    background: colors.pageBackground,
    color: colors.text,
    fontFamily: fonts.fontFamily,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    paddingTop: 50,
  },
  steps: {
    background: colors.background,
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
  },
};

// const query = await graphql`
//   query WorkflowQuery($projectID: ID!) {
//     project(id: $projectID) {
//       id
//     }
//   }
// `;

export default function Workflow(
  { clipsLength, transcriptLength, uploaded, projectId, setProjectId }: Props,
) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>();
  const [workflowTab, setWorkflowTab] = useState<number>(0);
  const { navigate } = useRouter();
  const enableYoutube = false;

  // const data = useLazyLoadQuery(query, {
  //   projectID: projectId,
  // }) as WorkflowQuery$data;
  // console.log(data);

  useEffect(() => {
    if (uploaded) {
      setUploadComplete(true);
    }
  }, [uploaded]);

  const handleProgress = (percent: number) => {
    if (percent === 100) {
      setUploadComplete(true);
    }
    setUploadPercent(percent);
  };

  const handleUpload = (uuid: string) => {
    navigate(`/project/${uuid}`);
    setProjectId(uuid);
    setUploadComplete(true);
  };

  const tabs: Tab[] = [
    {
      name: "Upload",
    },
    {
      name: "YouTube",
    },
  ];

  const showSteps = uploading || uploadComplete;

  const uploadSubtitle = null; // TODO Show upload size
  const transcriptSubtitle = transcriptLength > 0
    ? `${transcriptLength} words`
    : null;
  const clipsSubtitle = clipsLength > 0 ? `${clipsLength} clips found` : null;

  function Upload() {
    let text = "Upload a video file up to 500MB directly to the platform. ";
    if (enableYoutube) {
      text +=
        "If you want to use a bigger file, upload to YouTube using the tab above.";
    }

    return (
      <>
        <div>
          <h1>Upload a video</h1>
          <p>{text}</p>
        </div>
        <FileUpload
          onStart={() => setUploading(true)}
          onProgress={handleProgress}
          onComplete={handleUpload}
          onError={(message) => setUploadError(message)}
          projectId={projectId}
          maxSizeMB={500}
        />
      </>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container" style={styles.container}>
        {enableYoutube && <Tabs tabs={tabs} onTabSelected={setWorkflowTab} />}
        <div className="content" style={styles.content}>
          {workflowTab === 0 && <Upload />}
          {workflowTab === 1 && <WorkflowYoutube />}
          {showSteps && (
            <>
              <Step
                complete={uploadComplete}
                percent={uploadPercent}
                initialText="Upload"
                pendingText="Uploading..."
                completeText="Uploaded"
                errorText={uploadError}
                subtitle={uploadSubtitle}
              />
              <Step
                complete={transcriptLength > 0}
                pending={uploadComplete}
                initialText="Transcribe"
                pendingText="Transcribing..."
                completeText="Transcribed"
                subtitle={transcriptSubtitle}
              />
              <Step
                complete={clipsLength > 0}
                pending={transcriptLength > 0}
                initialText="Clips"
                pendingText="Finding clips..."
                completeText="Clips found"
                subtitle={clipsSubtitle}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
