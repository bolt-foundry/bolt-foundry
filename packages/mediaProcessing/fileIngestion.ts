import { rxjs } from "deps.ts";
import { streamFileToOpfs } from "lib/opfs.ts";
import {
  AudioStreamOutput,
  extractAudioToStream,
} from "packages/lib/extractAudio.ts";

const { map } = rxjs;

export function streamFileIngestion(
  file: File,
  fileName: string,
): rxjs.Observable<{ type: string; data: any }> {
  const fileObservable = streamFileToOpfs(file, fileName);
  const audioObservable = extractAudioToStream(fileObservable);
  const uploadObservable = uploadFileFromStream(audioObservable);
  const combinedObservable = rxjs.merge(
    fileObservable.pipe(map((event) => ({ type: "opfsEvent", data: event }))),
    audioObservable.pipe(
      map((output) => ({ type: "audioOutput", data: output })),
    ),
    uploadObservable.pipe(
      map((event) => ({ type: "uploadEvent", data: event })),
    ),
  );
  return combinedObservable;
}

type UploadEvent = {
  type: "uploading";
  progress: number;
  bytesUploaded: number;
  totalBytesToUpload: number;
};

function uploadFileFromStream(
  audioObservable: rxjs.Observable<AudioStreamOutput>,
): rxjs.Observable<UploadEvent> {
  const replaySubject = new rxjs.Subject<UploadEvent>();
  let bytesUploaded = 0;
  let totalBytesToUpload = 0;

  audioObservable.subscribe({
    next: async (audioChunkEvent) => {
      if (audioChunkEvent.type !== "encodedAudioChunk") {
        return;
      }

      const audioChunk = audioChunkEvent.data;
      totalBytesToUpload = audioChunkEvent.totalBytesExpected; // Update totalBytesToUpload with totalBytesExpected
      // console.log("Uploading chunk...", audioChunkEvent.progress);
      bytesUploaded += audioChunk.byteLength;
      replaySubject.next({
        type: "uploading",
        progress: audioChunkEvent.progress,
        bytesUploaded,
        totalBytesToUpload,
      });

      // try {
      //   const response = await fetch('/upload-endpoint', {
      //     method: 'POST',
      //     body: audioChunk, // Assuming audioChunk is the appropriate format
      //   });

      //   if (response.ok) {
      //     bytesUploaded += audioChunk.byteLength;
      //     const progress = bytesUploaded / totalBytesToUpload;

      //     replaySubject.next({
      //       type: "uploading",
      //       progress,
      //       bytesUploaded,
      //       totalBytesToUpload
      //     });
      //   } else {
      //     replaySubject.error(new Error("Failed to upload chunk"));
      //   }
      // } catch (error) {
      //   replaySubject.error(error);
      // }
    },
    complete: () => {
      replaySubject.complete();
    },
    error: (err) => {
      replaySubject.error(err);
    },
  });

  return replaySubject.asObservable();
}
