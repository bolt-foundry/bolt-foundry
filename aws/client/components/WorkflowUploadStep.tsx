import { Maybe, React } from "aws/client/deps.ts";
import Step from "aws/client/components/Step.tsx";
import { fonts } from "aws/client/ui_components/ui_const.tsx";

type Props = {
  uploadComplete: boolean;
  uploadPercent: number;
  uploadError: Maybe<string>;
};

export default function WorkflowUploadStep({
  uploadComplete,
  uploadPercent,
  uploadError,
}: Props) {
  const uploadSubtitle = uploadPercent > 0
    ? (
      <span>
        <span style={{ fontFamily: fonts.fontFamilyMono }}>
          {Math.round(uploadPercent)}
        </span>% uploaded
      </span>
    )
    : null;

  return (
    <Step
      complete={uploadComplete}
      percent={uploadPercent}
      initialText="Upload"
      pendingText="Uploading..."
      completeText="Uploaded"
      errorText={uploadError}
      subtitle={uploadSubtitle}
    />
  );
}
