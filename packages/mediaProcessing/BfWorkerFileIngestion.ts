import { getLogger, rxjs } from "deps.ts";
import { BfWorkerObservable } from "packages/bfWorker/BfWorker.ts";
import { BfError } from "lib/BfError.ts";
import {
  createMuxedFile,
  extractEncodedAudio,
} from "packages/mediaProcessing/encodingTools.ts";

const { Subject } = rxjs;

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

export type IngestionProgress = {
  type: "audio" | "opfs" | "upload";
  progress: number;
};

export type UploadEvent = {
  type: "uploading";
  progress: number;
  bytesUploaded: number;
  totalBytesToUpload: number;
};

export class BfWorkerFileIngestion extends BfWorkerObservable {
  static {
    this.registerWorker(
      this,
      "/packages/mediaProcessing/BfWorkerFileIngestion.ts",
    );
  }

  ingest = (file: File, name: string): rxjs.Observable<IngestionProgress> => {
    logger.info(`Ingesting ${file.name}`);
    const subject = new Subject<IngestionProgress>();
    (async () => {
      let totalBytesWritten = 0;
      const opfsDirectory = await navigator.storage.getDirectory();
      const totalFileWritableStream = await opfsDirectory.getFileHandle(name, {
        create: true,
      }).then((opfsFile) => opfsFile.createWritable());

      const reader = file.stream().getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        await totalFileWritableStream.write(value);
        totalBytesWritten += value.length;
        subject.next({
          type: "opfs",
          progress: totalBytesWritten / file.size,
        });
      }

      await totalFileWritableStream.close();

      subject.next({ type: "audio", progress: .001 });
      const fileHandle = await opfsDirectory.getFileHandle(name);
      const fileForReading = await fileHandle.getFile();
      const extractedAudio = await extractEncodedAudio(fileForReading);
      subject.next({ type: "audio", progress: .005 });

      const { encodedAudioChunks, sampleRate, numberOfChannels, codec } =
        extractedAudio;
      const audioChunks: Array<AudioData> = [];
      const audioDecoder = new AudioDecoder({
        output: (audioData) => {
          audioChunks.push(audioData);
          const timecode = audioData.timestamp / audioData.sampleRate / 1000;
        },
        error: (e) => {
          throw e;
        },
      });
      audioDecoder.configure({
        codec,
        numberOfChannels,
        sampleRate,
      });

      for (const chunk of encodedAudioChunks) {
        audioDecoder.decode(chunk);
      }

      await audioDecoder.flush();
      // create an mp4 by itself which has a single audio track
      const outputFile = await createMuxedFile(
        {
          input: {
            audio: {
              audioChunks,
              sampleRate,
              numberOfChannels,
            },
            // video: {
          },
          output: {
            audio: {
              bitrate: 96_000,
              numberOfChannels,
              sampleRate,
            },
          },
          events: {
            onAudioProgress: (progress) => {
              // // percent here is 0 - 1
              // const progress = (progressRatios.writing +
              //   (percent * progressRatios.encoding)) * 100;
              // onProgress(progress);
              subject.next({ type: "audio", progress });
            },
          },
        },
      );

      const audioFileName = `${name}_audio`;
      const audioFileHandle = await opfsDirectory.getFileHandle(audioFileName, {
        create: true,
      });
      const audioFileWritableStream = await audioFileHandle.createWritable();
      const outputFileReader = outputFile.stream().getReader();
      let bytesWritten = 0;
      while (true) {
        const { done, value } = await outputFileReader.read();
        if (done) {
          break;
        }
        await audioFileWritableStream.write(value);
        bytesWritten += value.length;
        logger.info(`percentage: ${bytesWritten / file.size}`);
      }
      subject.next({ type: "audio", progress: 1 });

      await audioFileWritableStream.close();
      logger.info("probably done", audioFileName);
    })();

    // const mappedEncodeProgress = encodeProgress.pipe(
    //   rxjs.map((progressEvent) => {
    //     if (progressEvent.type === "encodedAudioChunk") {
    //       return {
    //         type: "audio",
    //         progress: progressEvent.progress,
    //       };
    //     }
    //     logger.info(progressEvent)
    //   }),
    //   rxjs.filter(Boolean),
    // );

    return rxjs.merge(
      // mappedEncodeProgress,
      subject.asObservable(),
    );
  };
}
