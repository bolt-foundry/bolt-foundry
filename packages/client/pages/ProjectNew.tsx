import { getLogger, React } from "deps.ts";
import { graphql, ReactRelay } from "packages/client/deps.ts";
import { PageFrame } from "packages/client/components/PageFrame.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { clearOpfsStorage } from "lib/opfs.ts";
import { useBfDs } from "packages/bfDs/hooks/useBfDs.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { BfWorkerFileIngestion } from "packages/mediaProcessing/BfWorkerFileIngestion.ts";

const logger = getLogger(import.meta);

const { useState, useEffect } = React;

const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
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
};

export function ProjectNew() {
  const { navigate } = useRouter();
  const [commit] = useMutation<ProjectNewCreateNewProjectMutation>(mutation);
  const [commitCreateBffsFile] = useMutation<ProjectNewCreateBffsFileMutation>(
    createBffsFileMutation,
  );
  const [commitUploadFile] = useMutation<ProjectNewUploadFileMutation>(
    uploadFileMutation,
  );
  const [bffsFileName, setBffsFileName] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copyProgress, setCopyProgress] = useState(0);
  const [audioEncodeProgress, setAudioEncodeProgress] = useState(0);

  useEffect(() => {
    if (bffsFileName) {
      showToast(
        `Uploading ${(uploadProgress * 100).toFixed(2)}%, copying ${
          (copyProgress * 100).toFixed(2)
        }%, encoding ${(audioEncodeProgress * 100).toFixed(2)}%`,
        { id: bffsFileName },
      );
    }
  }, [uploadProgress, copyProgress, audioEncodeProgress, bffsFileName]);

  const { showToast } = useBfDs();

  return (
    <PageFrame>
      <div className="page" style={styles.page}>
        <div className="container" style={styles.container}>
          <div className="content" style={styles.content}>
            <div>
              <h1>Upload a video</h1>
            </div>
            <Button
              onClick={() => {
                commitUploadFile({
                  variables: {
                    file: null,
                  },
                  uploadables: {
                    file: new File(["foo"], "foo.txt", {
                      type: "text/plain",
                    }),
                  },
                  onCompleted: (result) => {
                    logger.info(result);
                  },
                });
              }}
              text="you can do it"
            />
            <ProjectUploader
              onSelect={(file) => {
                commitCreateBffsFile({
                  variables: { name: file.name },
                  onCompleted: (data) => {
                    const bfWorkerFileIngestion = new BfWorkerFileIngestion(
                      false,
                    );
                    const id = data.createBfMediaBffsFile?.id;
                    const fileName = id ?? file.name;
                    setBffsFileName(fileName);
                    const observable = bfWorkerFileIngestion.ingest(
                      file,
                      fileName,
                    );
                    observable.subscribe({
                      next: (value) => {
                        switch (value.type) {
                          case "audio": {
                            setAudioEncodeProgress(value.progress ?? 0 * 100);
                            break;
                          }
                          case "opfs": {
                            setCopyProgress(value.progress ?? 0 * 100);
                            break;
                          }
                          case "upload": {
                            setUploadProgress(value.progress ?? 0 * 100);
                            break;
                          }
                          default:
                            logger.info(value);
                        }
                      },
                      complete: () => {
                        showToast("File uploaded to OPFS");
                      },
                      error: (error) => {
                        showToast(`Error: ${error.message}`, {
                          timeout: 10000,
                        });
                      },
                    });
                  },
                });
              }}
              onUpload={() => {
                commit({
                  variables: { name: "test" },
                  onCompleted: (response) => {
                    const id = response.createProject?.id;
                    navigate(`/projects/${id}`);
                  },
                  onError: (err) => {
                    showToast(`Error: ${err.message}`, { timeout: 10000 });
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

type ProjectUploaderProps = {
  onUpload: (file: File | void) => void;
  onSelect: (file: File) => void;
};

function ProjectUploader({ onUpload, onSelect }: ProjectUploaderProps) {
  const [file, setFile] = React.useState<File>();
  React.useEffect(() => {
    if (file) {
      onSelect(file);
    }
  }, [file]);
  return (
    <>
      <input
        type="file"
        onChange={(e) => setFile((e?.target?.files ?? [])[0])}
      />
      <Button
        onClick={() => {
          onUpload(file);
        }}
        text="Create project"
      />
      <Button
        onClick={() => {
          clearOpfsStorage();
        }}
        text="Clear OPFS"
      />
    </>
  );
}
