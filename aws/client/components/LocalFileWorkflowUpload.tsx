import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import FileUpload from "aws/client/components/FileUpload.tsx";
import { LocalFileWorkflowUpload_project$key } from "aws/__generated__/LocalFileWorkflowUpload_project.graphql.ts";

const { useState } = React;

const fragment = await graphql`
  fragment LocalFileWorkflowUpload_project on Project {
    ...FileUpload_project
  }
`;

type Props = {
  project$key: LocalFileWorkflowUpload_project$key | null;
};

export default function LocalFileWorkflowUpload({
  project$key,
}: Props) {
  const [showSteps, setShowSteps] = useState(false);
  const [enableYoutube, setEnableYoutube] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const project = ReactRelay.useFragment(fragment, project$key);

  const handleProgress = (num: number) => {
    // TODO: Implement handleProgress method
    setUploadPercent(num);
  };

  const handleUpload = () => {
    // TODO: Implement handleUpload method
  };

  let text = "Upload a video file up to 2000MB directly to the platform. ";
  if (enableYoutube) {
    text +=
      "If you want to use a bigger file, upload to YouTube using the tab above.";
  }

  return !showSteps
    ? (
      <>
        <div>
          <h1>Upload a video!!!</h1>
          <p>{text}</p>
          <p>{uploadPercent}</p>
        </div>
        <FileUpload
          onStart={() => setUploading(true)}
          onProgress={handleProgress}
          onComplete={handleUpload}
          onError={(message) => setUploadError(message)}
          project$key={project}
          maxSizeMB={2000}
        />
      </>
    )
    : (
      <div>
        <h1>Processing video...</h1>
      </div>
    );
}
