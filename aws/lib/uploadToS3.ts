// uploadToS3.ts

type SignedUrlResponse = {
  signedUrl: string;
  uuid: string;
};

type ProgressCallback = (percent: number) => void;

export function uploadFileToS3(
  file: File,
  url: string,
  onProgress: ProgressCallback,
  onComplete: (event: unknown, url: string) => void,
): void {
  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable) {
      const progress = (event.loaded / event.total) * 100;
      onProgress(progress);
      if (progress === 100) {
        onComplete(event, url);
      }
    }
  });

  xhr.addEventListener("load", (_e) => {
    if (xhr.status >= 200 && xhr.status < 300) {
      // deno-lint-ignore no-console
      console.log("File uploaded successfully");
    }
  });

  xhr.addEventListener("error", (error) => {
    // deno-lint-ignore no-console
    console.error("Error uploading file:", error);
  });

  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", file.type);
  xhr.send(file);
}
