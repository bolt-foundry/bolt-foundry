// #BOOTCAMPTASK move this to packages/client/lib because the frontend needs it or something.

import { getLogger, rxjs } from "deps.ts";
import { BfError } from "lib/BfError.ts";
const { ReplaySubject } = rxjs;
const logger = getLogger(import.meta);

export class ErrorOpfsGenericError extends BfError {
  constructor(message = "Opfs had an unexpected issue") {
    super(message);
  }
}

export class ErrorOpfsNotSupported extends ErrorOpfsGenericError {
  constructor(message = "Opfs is not supported on this platform") {
    super(message);
  }
}

export type FileMetadata = {
  name: string;
  size: number;
};

type OpfsProgressEvent = {
  type: "progress";
  file: FileMetadata;
  bytesWritten: number;
  totalBytesWritten: number;
  data?: Uint8Array;
};

type OpfsCompletionEvent = {
  type: "completion";
  file: FileMetadata;
  message: string;
};

type OpfsErrorEvent = {
  type: "error";
  file: FileMetadata;
  error: ErrorOpfsGenericError;
};

export type OpfsEvent =
  | OpfsProgressEvent
  | OpfsCompletionEvent
  | OpfsErrorEvent;

export function streamFileToOpfs(
  file: File,
  fileName: string,
): rxjs.Observable<OpfsEvent> {
  const subject = new ReplaySubject<
    OpfsEvent
  >();
  const fileMetadata: FileMetadata = { name: fileName, size: file.size };

  (async () => {
    try {
      const opfsDirectory = await navigator.storage.getDirectory();
      const opfsFile = await opfsDirectory.getFileHandle(fileName, {
        create: true,
      });

      const writableStream = await opfsFile.createWritable();
      const reader = file.stream().getReader();
      let totalWritten = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writableStream.write(value);
        totalWritten += value.length;
        // logger.log(`Written ${totalWritten} bytes of ${file.size}`);

        subject.next({
          type: "progress",
          file: fileMetadata,
          bytesWritten: value.length,
          totalBytesWritten: totalWritten,
          data: value,
        });
      }

      await writableStream.close();
      logger.log("File successfully written to Opfs");

      subject.next({
        type: "completion",
        file: fileMetadata,
        message: "File successfully written to Opfs",
      });
      subject.complete();
    } catch (error) {
      subject.error({
        type: "error",
        file: fileMetadata,
        error: new ErrorOpfsGenericError(error.message),
      });
    }
  })();

  return subject.asObservable();
}

export async function clearOpfsStorage(): Promise<void> {
  if (confirm("Are you sure you want to remove all storage?")) {
    try {
      const opfsDirectory = await navigator.storage.getDirectory();
      for await (const entry of opfsDirectory.values()) {
        await opfsDirectory.removeEntry(entry.name, { recursive: true });
      }
      alert("All storage has been cleared.");
    } catch (error) {
      alert(`Failed to clear storage: ${error.message}`);
    }
  }
}
