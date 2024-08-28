import { type Maybe, React, type ReactRelay } from "deps.ts";
// import { CreateNewProject_project$key } from "packages/__generated__/CreateNewProject_project.graphql.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { WorkflowUploadStep } from "packages/client/components/WorkflowUploadStep.tsx";
import { WorkflowTranscribeStep } from "packages/client/components/WorkflowTranscribeStep.tsx";
import { WorkflowClipStep } from "packages/client/components/WorkflowClipStep.tsx";
import { Step } from "packages/client/components/Step.tsx";
import { useFeatureFlag } from "packages/client/hooks/featureFlagHooks.ts";
import TVStatic from "packages/client/images/TVStatic.tsx";

const { Suspense, useEffect, useState } = React;

const styles: Record<string, React.CSSProperties> = {
  art: {
    width: 200,
    margin: "24px auto 0",
  },
  container: {
    width: 600,
    maxWidth: "95%",
    background: "var(--background)",
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
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    paddingTop: 50,
    boxSizing: "border-box",
  },
  steps: {
    background: "var(--background)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--border)",
    padding: "22px 28px",
  },
};

type Props = {
  project$key: CreateNewProject_project$key | null;
};

// const fragment = await graphql`
//   fragment CreateNewProject_project on Project {
//     videoUrl
//     ...FileUpload_project
//     ...WorkflowClipStep_project
//     ...WorkflowTranscribeStep_project
//     ...LocalFileWorkflowUpload_project
//     }`;

export function ProjectUploadStatus({ project$key }: Props) {
  const { navigate } = useRouter();
  // const project = ReactRelay.useFragment(fragment, project$key);
  const project = {};
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadCompleted, setUploadComplete] = useState<boolean>(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>();
  const enableLocalFileWorkflowUpload = useFeatureFlag(
    "local_audio_transcribing_pipeline",
  );

  // Reset state when project$key changes
  React.useEffect(() => {
    setUploadComplete(false);
    setUploading(false);
    setUploadPercent(0);
    setUploadError(null);
  }, [project$key]);

  const onServer = typeof globalThis.Deno !== "undefined";
  if (onServer) {
    // skip disable check
  } else if (
    !("createWritable" in FileSystemFileHandle?.prototype) ||
    typeof AudioEncoder === "undefined" || typeof AudioDecoder === "undefined"
  ) {
    return (
      <div style={styles.page}>
        <div className="container" style={styles.container}>
          <div
            className="content"
            style={{ ...styles.content, textAlign: "center", gap: 0 }}
          >
            <div style={styles.art}>
              <TVStatic />
            </div>
            <h1>Browser Not Supported</h1>
            <div>
              We're so sorry. 😞 This feature is not currently supported in your
              browser. For now, we've found that Chrome supports most of the
              browser features we use. You can download Chrome{" "}
              <a href="https://www.google.com/chrome/dr/download/">here</a>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const uploaded = project?.videoUrl != null;

  const uploadComplete = Boolean(
    uploadCompleted || uploaded || project?.videoUrl,
  );
  const handleProgress = (percent: number) => {
    if (percent === 100) {
      setUploadComplete(true);
    }
    setUploadPercent(percent);
  };

  const handleUpload = (projectUrl: string) => {
    navigate(projectUrl);
    setUploadComplete(true);
  };

  return (
    <div className="page" style={styles.page}>
      <div className="container" style={styles.container}>
        <div className="content" style={styles.content}>
          <div>
            <h1>Processing video...</h1>
          </div>
          <div style={styles.steps}>
            <WorkflowUploadStep
              uploadComplete={uploadComplete}
              uploadPercent={uploadPercent}
              uploadError={uploadError}
            />
            {project != null
              ? (
                <Suspense fallback={<EmptySteps />}>
                  <WorkflowTranscribeStep project$key={project} />
                  <WorkflowClipStep project$key={project} />
                </Suspense>
              )
              : <EmptySteps />}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySteps() {
  return (
    <>
      <Step
        complete={false}
        initialText="Transcribe"
      />
      <Step
        complete={false}
        initialText="Clips"
      />
    </>
  );
}
