import { captureEvent } from "aws/events/mod.ts";

export function downloadText(
  text: string,
  filename: string,
  cbStarted?: () => void,
  cbFinished?: () => void,
  personId?: string,
) {
  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  cbStarted?.();
  setTimeout(() => {
    document.body.removeChild(element);
    cbFinished?.();
  }, 2000);
  captureEvent("transcript", "downloaded", {
    format: filename.split(".").pop(),
  }, personId);
}
