import { MP4Box, Mp4Muxer } from "aws/client/deps.ts";
import PerfLogger from "aws/perf/mod.ts";
const { Muxer, ArrayBufferTarget } = Mp4Muxer;
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
// const log = console.log;
// const warn = console.warn;
const log = logger.info;
const warn = logger.warn;
type ProgressCallback = (percent: number) => void;

type AudioInputOptions = {
  sampleRate: number;
  numberOfChannels: number;
  audioChunks: Array<AudioData>;
};

type VideoInformation = {
  width: number;
  height: number;
  videoFrames: Array<VideoFrame>;
};

type Events = {
  onAudioProgress?: ProgressCallback;
  onVideoProgress?: ProgressCallback;
  onComplete?: () => void;
  onError?: (error: Error) => void;
};

type CreateMuxedFileOptions = {
  input: {
    audio?: AudioInputOptions;
    video?: VideoInformation;
  };
  output: {
    // @ts-expect-error #techdebt
    video?: Mp4Muxer.VideoConfig;
    // @ts-expect-error #techdebt
    audio?: Mp4Muxer.AudioConfig;
  };
  events?: Events;
  title? : string;
};

export async function createMuxedFile(
  options: CreateMuxedFileOptions,
): Promise<File> {
  const duration = (options.input.video?.videoFrames.length ?? Infinity) *
    1000 / 30;
  log(duration);
  const title = options.title ?? "bolt-foundry-file.mp4";
  const perfLogger = new PerfLogger(duration);
  let audioEncoder: AudioEncoder | null = null;
  let videoEncoder: VideoEncoder | null = null;
  const stopAudioPerf = perfLogger.log("encodeAudio");
  if (options.input.audio) {
    log("found audio");
    const chunksAvailable = options.input.audio.audioChunks.length;
    let chunksEncoded = 0;
    audioEncoder = new AudioEncoder({
      output: (encodedAudioChunk, meta) => {
        chunksEncoded++;
        const progress = chunksEncoded / chunksAvailable;
        options.events?.onAudioProgress?.(progress);
        // log("adding audio chunk", encodedAudioChunk.timestamp, meta);
        muxer.addAudioChunk(encodedAudioChunk, meta);
      },
      error: (e) => {
        log("audioEncoder error", e);
        options.events?.onError?.(e);
      },
    });

    log("audioEncoderConfig", options.output.audio);
    audioEncoder.configure({
      codec: "mp4a.40.2",
      numberOfChannels: options.output.audio.numberOfChannels,
      sampleRate: options.output.audio.sampleRate,
    });
    log("audioEncoder configured", audioEncoder.state);
    log("encoding audio chunks", options.input.audio.audioChunks.length);
    for (const chunk of options.input.audio.audioChunks) {
      // log("encoding audio chunk", chunk.timestamp);
      audioEncoder.encode(chunk);
    }
  }
  const stopFrameEncoding = perfLogger.log("encodeFrames");
  if (options.input.video) {
    log("found video");
    const lastTimestamp = options.input.video.videoFrames[
      options.input.video.videoFrames.length - 1
    ].timestamp;
    const framePerfCallbacks: Array<() => void> = [];
    videoEncoder = new VideoEncoder({
      output: (chunk, metadata) => {
        const progress = chunk.timestamp / lastTimestamp;
        options.events?.onVideoProgress?.(progress);
        // log("adding video chunk", chunk.timestamp, metadata);
        muxer.addVideoChunk(chunk, metadata);
        const framePerfCallbackToStop = framePerfCallbacks.shift();
        framePerfCallbackToStop?.();
      },
      error: (e) => {
        options.events?.onError?.(e);
      },
    });
    videoEncoder.configure({
      codec: "avc1.42E028",
      width: options.input.video.width,
      height: options.input.video.height,
      bitrate: 2_000_000, // 2 Mbps
      framerate: 30,
      hardwareAcceleration: "prefer-hardware",
      avc: { format: "avc" },
    });
    log("videoEncoder configured", videoEncoder.state);
    for (const frame of options.input.video.videoFrames) {
      framePerfCallbacks.push(perfLogger.log("encodeFrame"));
      videoEncoder.encode(frame);

      frame.close();
    }
  }

  const muxerOptions = {
    firstTimestampBehavior: "offset",
    target: new ArrayBufferTarget(),
  };
  if (options.output.audio) {
    // @ts-expect-error #techdebt
    muxerOptions.audio = { ...options.output.audio, ...{ codec: "aac" } };
  }

  if (options.output.video) {
    // @ts-expect-error #techdebt
    muxerOptions.video = { ...options.output.video, ...{ codec: "avc" } };
  }

  // @ts-expect-error #techdebt
  const muxer = new Muxer(muxerOptions);

  const videoEncoderFlushPromise = videoEncoder?.flush();
  videoEncoderFlushPromise?.then(() => {
    stopFrameEncoding();
  });
  const audioEncoderFlushPromise = audioEncoder?.flush();
  audioEncoderFlushPromise?.then(() => {
    stopAudioPerf();
  });
  await Promise.all([audioEncoderFlushPromise, videoEncoderFlushPromise]);

  muxer.finalize();
  const { buffer } = muxer.target;
  const file = new File([buffer], title);
  const perfReport = perfLogger.report();
  // deno-lint-ignore no-console
  console.table(perfReport);
  return file;
}

type ExtractAudioOptions = {
  start?: number;
  end?: number;
};

type ExtractAudioResult = {
  encodedAudioChunks: Array<EncodedAudioChunk>;
  sampleRate: number;
  numberOfChannels: number;
  codec: string;
  sampleSize: number;
};

export async function extractEncodedAudio(
  file: File,
  // _options: ExtractAudioOptions = { start: 0, end: Infinity },
): Promise<ExtractAudioResult> {
  log("Extracting audio from file", file.name);
  const arrayBuffer = await file.arrayBuffer();
  const mp4boxFile = MP4Box.createFile();

  return new Promise((resolve, reject) => {
    // @ts-expect-error #techdebt
    mp4boxFile.onError = function (e) {
      return reject(new Error(e));
    };
    // @ts-expect-error #techdebt
    mp4boxFile.onReady = function (info) {
      log("mp4box is ready", info);
      // @ts-expect-error #techdebt
      const firstAudioTrack = info.tracks.find((track) =>
        track.type === "audio"
      );
      // @ts-expect-error #techdebt
      const audioTracksCount = info.tracks.filter((track) =>
        track.type === "audio"
      ).length;
      if (audioTracksCount > 1) {
        warn("More than one audio track found, using first one");
      }
      if (!firstAudioTrack) {
        return reject(new Error("No audio track found"));
      }
      mp4boxFile.setExtractionOptions(
        firstAudioTrack.id,
        firstAudioTrack,
        {},
      );
      log("Set extraction options", firstAudioTrack);

      // @ts-expect-error #techdebt
      mp4boxFile.onSamples = function (_trackId, _, samples) {
        for (const sample of samples) {
          const timestamp = sample.dts;
          const data = sample.data;
          const encodedAudioChunk = new EncodedAudioChunk({
            data,
            timestamp,
            type: "key",
          });
          encodedAudioChunks.push(encodedAudioChunk);

          if (encodedAudioChunks.length === firstAudioTrack.nb_samples) {
            log("mp4box finished");
            resolve({
              encodedAudioChunks,
              sampleRate: firstAudioTrack.audio.sample_rate,
              numberOfChannels: firstAudioTrack.audio.channel_count,
              codec: firstAudioTrack.codec,
              sampleSize: firstAudioTrack.audio.sample_size,
            });
          }
        }
      };
      log("Starting mp4box");
      mp4boxFile.start();
    };
    const encodedAudioChunks: Array<EncodedAudioChunk> = [];

    // @ts-expect-error #techdebt
    arrayBuffer.fileStart = 0;
    log("Appending buffer to mp4box");
    mp4boxFile.appendBuffer(arrayBuffer);
  });
}

export async function test() {
  // Video Portion
  const videoFrames = await new Promise<Array<VideoFrame>>(
    (resolve: (frames: Array<VideoFrame>) => void) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      document.body.appendChild(canvas);

      const ctx = canvas.getContext("2d");

      let count = 0;
      let frameCounter = 0;
      const endFrame = 300;
      const frames: Array<VideoFrame> = [];
      for (let i = frameCounter; i < endFrame; i++) {
        count++;
        if (count === 15) {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          ctx!.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
          count = 0;
        }
        const frame = new VideoFrame(canvas, {
          timestamp: i * 1000 * 1000 / 30,
        });
        frames.push(frame);
        frameCounter++;
        if (frameCounter === endFrame - 1) {
          resolve(frames);
        }
      }
    },
  );
  let audioDecoder: AudioDecoder | null = null;

  //Audio Portion
  const url =
    "https://bf-static-assets.s3.amazonaws.com/test-files/mov_bbb.mp4";
  // load video from url as file and the await file.arrayBuffer()
  const response = await fetch(url);
  const blob = await response.blob();
  const testAudioFile = new File([blob], "mov_bbb.mp4");
  const { encodedAudioChunks, sampleRate, numberOfChannels, codec } =
    await extractEncodedAudio(
      testAudioFile,
    );
  // Audio Decoding
  const decodedAudioChunks: Array<AudioData> = [];
  audioDecoder = new AudioDecoder({
    output: (audioData) => {
      decodedAudioChunks.push(audioData);
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
  log("audioDecoder configured", audioDecoder.state);

  for (const chunk of encodedAudioChunks) {
    audioDecoder.decode(chunk);
  }
  if (audioDecoder != null) {
    await audioDecoder.flush();
  }

  // Muxing
  log("muxing");
  const muxedFile = await createMuxedFile({
    input: {
      audio: {
        audioChunks: decodedAudioChunks,
        numberOfChannels,
        sampleRate,
      },
      video: {
        videoFrames,
        width: 1920,
        height: 1080,
      },
    },
    output: {
      audio: {
        numberOfChannels,
        sampleRate,
      },
      video: {
        width: 1920,
        height: 1080,
      },
    },
    events: {
      // @ts-expect-error #techdebt
      onProgress: (percent) => {
        log("progress", percent);
      },
      onComplete: () => {
        log("complete");
      },
      onError: (error) => {
        log("error", error);
      },
    },
  });
  //download
  const muxedFileUrl = URL.createObjectURL(muxedFile);
  const a = document.createElement("a");
  a.href = muxedFileUrl;
  a.download = "testMuxedDownload.mp4";
  a.click();
  URL.revokeObjectURL(muxedFileUrl);
}

export async function getSampleRateFromVideoElement(
  videoElement: HTMLVideoElement,
): Promise<number> {
  if (!videoElement.src) {
    throw new Error("Video element src is not set.");
  }
  return await new Promise((resolve, reject) => {
    videoElement.addEventListener("canplay", () => {
      try {
        const audioCtx =
          new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        const stream = videoElement.captureStream();
        const sourceNode = audioCtx.createMediaStreamSource(stream);
        // Create a script processor node with a buffer size, number of input channels, and number of output channels
        const scriptProcessorNode = audioCtx.createScriptProcessor(4096, 1, 1);
        sourceNode.connect(scriptProcessorNode);
        scriptProcessorNode.connect(audioCtx.destination);
        scriptProcessorNode.onaudioprocess = function (audioProcessingEvent) {
          const inputBuffer = audioProcessingEvent.inputBuffer;
          // Get the sample rate
          const sampleRate = inputBuffer.sampleRate;
          audioCtx.close(); // Clean up the AudioContext
          resolve(sampleRate); // Resolve the sample rate
        };
        videoElement.play(); // Play the video to trigger audio processing
      } catch (error) {
        reject(error);
      }
    }, { once: true });
  });
}
