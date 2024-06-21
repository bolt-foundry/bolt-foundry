/// <reference types="https://esm.sh/v135/@types/dom-webcodecs@0.1.11/index.d.ts" />
import PoseFilter from "aws/client/lib/poseFilter.ts";
import {
  createMuxedFile,
  extractEncodedAudio,
} from "aws/client/lib/encodingTools.ts";
import { DGWord } from "aws/types/transcript.ts";
import { TensorFlowPoseDetection  } from "aws/client/deps.ts";
import { captureEvent } from "aws/events/mod.ts";
import PerfLogger from "aws/perf/mod.ts";
import { RenderSettings } from "aws/types/settings.ts";
import { createBfLogger } from "aws/logs/mod.ts";
import {
  getCurrentCropIndex,
  ManualCrop,
} from "aws/client/components/ManualCropMenu.tsx";
const logVerbose = createBfLogger(import.meta, "verbose");
const logError = createBfLogger(import.meta, "error");

function getAssetUrlCb(assetName: string) {
  return `/resources/gxpkg/${assetName}`;
}

const ENABLE_TRACKING = false; // disabled until we figure out what's going on with tensorflow.

// Kalman Filter parameters
const PROCESS_NOISE = 0.01; // increase to trust predictions more than measurements
const MEASUREMENT_NOISE = 0.2; // decrease this to trust measurements more than predictions
const ERROR_COVARIANCE = 1e4;
const MOVEMENT_THRESHOLD_PCT = 0.02;
const DEFAULT_LARGE_MOVEMENT_THRESHOLD_PCT = 0.1;
const EASING_FACTOR = 0.05;

const AUDIO_DECODING_BUFFER_IN_SECONDS = 0;

type ConstructorProps = {
  featureFlags: Record<string, boolean>;
  settings: RenderSettings;
  videoUrl: string;
  width: number;
  height: number;
  startTimecode: number;
  endTimecode: number;
  rootElement: HTMLElement;
  fps?: number;
  transcriptWords: Array<DGWord>;
  manualCrop: Array<ManualCrop>;
  manualCropActive: boolean;
  title: string;
};

// @ts-expect-error #techdebt
function convertPoseToMap(pose) {
  const poseMap = {};
  for (const keypoint of pose.keypoints) {
    // @ts-expect-error #techdebt
    poseMap[keypoint.name] = {
      ...keypoint,
    };
  }
  return poseMap;
}

// @ts-expect-error #techdebt
function convertPosesToMap(poses) {
  return poses.map(convertPoseToMap);
}

function drawCropFrameDebug(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filteredX: number,
) {
  ctx.beginPath();
  ctx.rect(
    filteredX - width / 2,
    0,
    width,
    height,
  );
  ctx.fillStyle = "rgba(0,255,0,0.5)";
  ctx.fill();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.closePath();
}

function drawGuides(
  ctx: CanvasRenderingContext2D,
  x: number,
  srcWidth: number,
  srcHeight: number,
  scaledWidth: number,
  scaledHeight: number,
  firstPose: Record<string, Record<string, number>>,
  filteredX: number,
) {
  // Calculate the source's aspect ratio and the target aspect ratio
  const srcAspectRatio = srcWidth / srcHeight;
  const targetAspectRatio = scaledWidth / scaledHeight;

  // Determine the width and height of the cropped area on the source
  let cropWidth = srcWidth;
  let cropHeight = srcHeight;
  if (srcAspectRatio > targetAspectRatio) {
    // Source is wider than target, so crop the width
    cropWidth = srcHeight * targetAspectRatio;
    cropHeight = srcHeight;
  }

  // Calculate the scale factors based on the cropped and scaled dimensions
  const xScale = scaledWidth / cropWidth;
  const yScale = scaledHeight / cropHeight;

  const earCenter = (firstPose["left_ear"].x + firstPose["right_ear"].x) / 2;
  const earCenterY = (firstPose["left_ear"].y + firstPose["right_ear"].y) / 2;
  const objects = [
    { // filtered x
      x: filteredX,
      y: earCenterY,
      radius: 20,
      color: "blue",
    },
    { // ear center
      x: earCenter,
      y: earCenterY,
      radius: 10,
      color: "red",
    },
    { // nose
      x: firstPose["nose"].x,
      y: firstPose["nose"].y,
      radius: 10,
      color: "gray",
    },
    { // left ear
      x: firstPose["left_ear"].x,
      y: firstPose["left_ear"].y,
      radius: 10,
      color: "white",
    },
    { // right ear
      x: firstPose["right_ear"].x,
      y: firstPose["right_ear"].y,
      radius: 10,
      color: "white",
    },
  ];
  // draw guides
  objects.forEach((object) => {
    const halfRadius = object.radius / 2;
    ctx.beginPath();
    ctx.arc(
      ((object.x - x) * xScale) - halfRadius,
      (object.y * yScale) - halfRadius,
      object.radius,
      0,
      2 * Math.PI,
    );
    ctx.fillStyle = object.color;
    ctx.fill();
    ctx.closePath();
  });

  // center line
  const centerX = scaledWidth / 2; // Calculate the center X position
  const lineStartY = 0; // Start at the top of the canvas
  const lineEndY = scaledHeight; // End at the bottom of the canvas

  ctx.beginPath(); // Begin a new path for the line
  ctx.moveTo(centerX, lineStartY); // Move to the start position of the line
  ctx.lineTo(centerX, lineEndY); // Draw a line to the end position
  ctx.strokeStyle = "green"; // Set the color of the line to green
  ctx.lineWidth = 2; // Set the line width. Adjust as needed.
  ctx.stroke(); // Render the line
  ctx.closePath(); // Close the path
}

export default class BFRenderer {
  // deno-lint-ignore no-explicit-any
  public comp: any;
  // deno-lint-ignore no-explicit-any
  public compApi: any;
  public featureFlags: Record<string, boolean>;
  public settings: RenderSettings;
  public endCapLength: number;
  public fps: number;
  public videoUrl: string;
  public outputWidth: number;
  public outputHeight: number;
  public outputRatio: number;
  public srcWidth: number;
  public srcHeight: number;
  public startTimecode: number;
  public endTimecode: number;
  public srcVideoElement: HTMLVideoElement;
  public preCropCanvas: HTMLCanvasElement;
  private cropCanvas: HTMLCanvasElement;
  private srcCanvas: HTMLCanvasElement;
  public srcVideoElementStream: MediaStream | null = null;
  public streamVideoElement: HTMLVideoElement;
  public transcriptWords: Array<DGWord>;
  public rootElement: HTMLElement;
  public dataIsLoaded: Promise<void>;
  public compositionIsLoaded: Promise<void>;
  public audioIsLoaded: Promise<void>;
  public videoFrames: Array<VideoFrame> = [];
  public audioChunks: Array<AudioData> = [];
  public numberOfChannels = 2;
  public sampleRate = 48000;

  public renderingProgress: {
    [key: string]: number;
  } = {};
  public progressCallback: (progress?: number) => void = () => {};
  public cancelRequested = false;
  public detector: TensorFlowPoseDetection.PoseDetector | null = null;
  private kfX: PoseFilter;
  private kfY: PoseFilter;
  private kfCrop: PoseFilter;
  private perfLogger: PerfLogger;
  private manualCrop: Array<ManualCrop>;
  private manualCropActive = false;
  private title: string;

  constructor(props: ConstructorProps) {
    this.srcVideoElement = document.createElement("video");
    this.streamVideoElement = document.createElement("video");
    this.featureFlags = props.featureFlags;
    this.settings = props.settings;
    // ------- adjust length of clip to show end cap
    const renderOptions = JSON.parse(props.settings.additionalJson ?? "[]");
    const showEndCap = !!renderOptions.useEndCap;
    this.endCapLength = showEndCap ? 4 : 0;
    // -------
    this.manualCrop = props.manualCrop;
    this.manualCropActive = props.manualCropActive;
    this.title = props.title ?? "";
    this.videoUrl = props.videoUrl;
    this.outputWidth = props.width;
    this.outputHeight = props.height;
    this.outputRatio = props.settings.ratio;
    this.srcWidth = props.width;
    this.srcHeight = props.height;
    this.startTimecode = props.startTimecode;
    this.endTimecode = props.endTimecode;
    this.rootElement = props.rootElement;
    this.fps = props.fps ?? 30;
    // Canvas to use to manually crop original srcVideoElement
    this.preCropCanvas = document.createElement("canvas");
    this.preCropCanvas.id = "pre-crop";
    this.preCropCanvas.width = this.outputWidth;
    this.preCropCanvas.height = this.outputHeight;
    this.preCropCanvas.style.position = "fixed";
    this.preCropCanvas.style.bottom = "300px";
    this.preCropCanvas.style.left = "-12000px"; // offscreen
    this.preCropCanvas.style.width = "100px";
    this.srcCanvas = document.createElement("canvas");
    this.srcCanvas.id = "src";
    this.srcCanvas.width = this.outputWidth;
    this.srcCanvas.height = this.outputHeight;
    this.srcCanvas.style.position = "fixed";
    this.srcCanvas.style.bottom = "10px";
    this.srcCanvas.style.left = "-12000px"; // offscreen
    this.srcCanvas.style.width = "100px";
    this.cropCanvas = document.createElement("canvas");
    this.cropCanvas.id = "crop";
    this.cropCanvas.width = this.outputWidth;
    this.cropCanvas.height = this.outputHeight;
    this.cropCanvas.style.position = "fixed";
    this.cropCanvas.style.bottom = "10px";
    this.cropCanvas.style.left = "-12120px"; // offscreen
    this.cropCanvas.style.width = "100px";
    const clipDuration = this.endTimecode - this.startTimecode +
      this.endCapLength;
    this.perfLogger = new PerfLogger(clipDuration * 1000);

    this.dataIsLoaded = this.setupElements();
    this.compositionIsLoaded = this.setupVideoRendering();
    this.audioIsLoaded = this.setupAudioRendering();
    this.transcriptWords = props.transcriptWords;
    const largeMovementThresholdPct =
      props.settings.largeMovementThresholdPct ??
        DEFAULT_LARGE_MOVEMENT_THRESHOLD_PCT;
    this.kfX = new PoseFilter(
      PROCESS_NOISE,
      MEASUREMENT_NOISE,
      ERROR_COVARIANCE,
      MOVEMENT_THRESHOLD_PCT,
      largeMovementThresholdPct,
      this.outputRatio,
      this.outputWidth,
      EASING_FACTOR,
    );
    this.kfY = new PoseFilter(
      PROCESS_NOISE,
      MEASUREMENT_NOISE,
      ERROR_COVARIANCE,
      MOVEMENT_THRESHOLD_PCT,
      largeMovementThresholdPct,
      this.outputRatio,
      this.outputWidth,
      EASING_FACTOR,
    );
    this.kfCrop = new PoseFilter(
      PROCESS_NOISE,
      MEASUREMENT_NOISE,
      ERROR_COVARIANCE,
      MOVEMENT_THRESHOLD_PCT,
      largeMovementThresholdPct,
      this.outputRatio,
      this.outputWidth,
      EASING_FACTOR,
    );
  }

  private async setupElements() {
    const playable = new Promise<void>((resolve) =>
      this.srcVideoElement.addEventListener("canplay", () => {
        resolve();
      }, { once: true })
    );
    // Event listener for 'loadedmetadata' to get video dimensions
    const metadataLoaded = new Promise<void>((resolve) => {
      this.srcVideoElement.addEventListener("loadedmetadata", () => {
        const videoWidth = this.srcVideoElement.videoWidth;
        const videoHeight = this.srcVideoElement.videoHeight;

        this.srcWidth = videoWidth;
        this.srcHeight = videoHeight;
        this.preCropCanvas.width = videoWidth;
        this.preCropCanvas.height = videoHeight;
        this.srcCanvas.width = videoWidth;
        this.srcCanvas.height = videoHeight;
        this.kfX.updateWidth(videoWidth);
        this.kfY.updateWidth(videoWidth);
        this.kfCrop.updateWidth(videoWidth);

        resolve();
      }, { once: true });
    });
    this.srcVideoElement.src = this.videoUrl;
    this.srcVideoElement.crossOrigin = "anonymous";
    // this.srcVideoElement.autoplay = true;
    this.srcVideoElement.muted = true;
    this.srcVideoElement.loop = true;
    this.srcVideoElement.style.position = "fixed";
    this.srcVideoElement.style.bottom = "0";
    this.srcVideoElement.style.right = "0";
    this.srcVideoElement.style.width = "1px";
    this.srcVideoElement.style.height = "1px";
    this.srcVideoElement.style.pointerEvents = "none";
    this.srcVideoElement.currentTime = this.startTimecode;
    document.body.appendChild(this.srcVideoElement);

    if (this.settings.useTracking || this.manualCropActive) {
      document.body.appendChild(this.preCropCanvas);
      document.body.appendChild(this.srcCanvas);
      document.body.appendChild(this.cropCanvas);
      this.srcVideoElementStream = this.cropCanvas.captureStream();
    } else {
      // @ts-expect-error #techdebt
      this.srcVideoElementStream = await this.srcVideoElement.captureStream();
    }
    this.streamVideoElement.srcObject = this.srcVideoElementStream;
    this.streamVideoElement.autoplay = true;
    this.streamVideoElement.muted = true;
    this.streamVideoElement.loop = true;
    this.streamVideoElement.style.position = "fixed";
    this.streamVideoElement.style.bottom = "0";
    this.streamVideoElement.style.right = "0";
    this.streamVideoElement.style.width = "1px";
    this.streamVideoElement.style.height = "1px";
    this.streamVideoElement.style.pointerEvents = "none";
    // this.streamVideoElement.currentTime = this.startTimecode;
    document.body.appendChild(this.streamVideoElement);

    if (this.settings.showTrackingDebug) {
      this.preCropCanvas.style.left = "10px";
      this.srcCanvas.style.left = "120px";
      this.cropCanvas.style.left = "10px";
      this.srcVideoElement.style.bottom = "0";
      this.srcVideoElement.style.right = "160px";
      this.srcVideoElement.style.width = "160px";
      this.srcVideoElement.style.height = "90px";
      this.streamVideoElement.style.bottom = "0";
      this.streamVideoElement.style.right = "0";
      this.streamVideoElement.style.width = "160px";
      this.streamVideoElement.style.height = "90px";
    }
    await playable;
    await metadataLoaded;
  }

  cancel() {
    this.cancelRequested = true;
    this.clearFrames();
  }

  clearFrames() {
    this.videoFrames.forEach((frame) => frame.close());
    this.videoFrames = [];
  }

  async autoFrameAndCrop() {
    let x = 0;
    let y = 0;
    let width = this.srcWidth;
    let height = this.srcHeight;
    if (this.detector != null) {
      const stopDetectorTimer = this.perfLogger.log("detector");
      // assuming source video is widescreen
      if (this.srcWidth / this.srcHeight < 1) {
        // TODO handle other aspect ratios
        logError("Source video must be widescreen");
      }
      // if output aspect ratio is tall, set crop width based on source sizes
      // height is always the same
      if (this.outputRatio < 1) {
        width = this.srcHeight * this.outputRatio;
      }
      // Draw the entire video frame onto the source canvas at the top left corner
      const srcCtx = this.srcCanvas.getContext("2d");
      srcCtx?.drawImage(this.preCropCanvas, 0, 0);
      const poses = await this.detector.estimatePoses(this.srcCanvas);

      const shouldCrop = this.settings.useAutocropping;

      let firstPose = null;
      let earCenter = null;
      let desiredHeight = null;
      let desiredY = null;
      if (poses.length > 0) {
        const posesMap = convertPosesToMap(poses);
        firstPose = posesMap[0];
        earCenter = (firstPose["left_ear"].x + firstPose["right_ear"].x) / 2;
        if (shouldCrop) {
          // const bottomPointY = Math.min(
          //   this.srcHeight,
          //   firstPose["left_ankle"].y,
          // );
          const bottomPointY = this.srcHeight;
          const noseY = firstPose["nose"].y;
          const shoulderY = firstPose["right_shoulder"].y;
          const noseToShoulder = shoulderY - noseY;
          const bodyHeight = bottomPointY - noseY;
          // add padding to the body height based on the nose to mouth distance
          const paddingMin = noseToShoulder * 2;
          const paddingMax = bodyHeight * 0.2;
          const padding = Math.max(paddingMin, paddingMax);
          desiredHeight = bodyHeight + padding;

          // Calculate the desired top y-coordinate for the crop
          desiredY = noseY - padding;
        }
      }

      const filteredX = this.kfX.update(earCenter);
      // Calculate the top-left coordinates (x,y) to center the ears in the crop
      x = filteredX - width / 2;
      y = 0;
      if (shouldCrop) {
        const filteredHeight = this.kfCrop.update(desiredHeight);
        height = Math.min(filteredHeight, this.srcHeight);
        width = height * this.outputRatio;

        const filteredY = this.kfY.update(desiredY);
        // Ensure y doesn't go below 0 or above the maximum allowable y-coordinate
        y = Math.max(0, Math.min(filteredY, this.srcHeight - height));
        // adjust x based on the new width
        x = filteredX - width / 2;
      }
      // center face in image
      const ctx = this.cropCanvas.getContext("2d");
      ctx?.drawImage(
        this.preCropCanvas,
        x, // The x-coordinate on the source video (left) where to start cropping
        y, // The y-coordinate on the source video (top) where to start cropping
        width, // The width of the rectangle to be cropped from the source video
        height, // The height of the rectangle to be cropped from the source video
        0, // The x-coordinate on the cropCanvas where the cropped image should be placed
        0, // The y-coordinate on the cropCanvas where the cropped image should be placed
        this.cropCanvas.width, // The width to which the cropped image should be scaled
        this.cropCanvas.height, // The height to which the cropped image should be scaled
      );
      if (this.settings.showTrackingDebug) {
        if (ctx && firstPose) {
          drawGuides(
            ctx,
            x,
            this.srcWidth,
            this.srcHeight,
            this.cropCanvas.width,
            this.cropCanvas.height,
            firstPose,
            filteredX,
          );
        }
        if (srcCtx) {
          drawCropFrameDebug(srcCtx, width, height, filteredX);
        }
      }
      stopDetectorTimer();
    } else {
      // Adjust the dimensions to match the cropCanvas aspect ratio
      const preCropAspectRatio = this.preCropCanvas.width /
        this.preCropCanvas.height;
      const canvasAspectRatio = this.cropCanvas.width /
        this.cropCanvas.height;
      if (preCropAspectRatio > canvasAspectRatio) {
        // Crop width is too wide, adjust width
        const newWidth = height * canvasAspectRatio;
        x += (width - newWidth) / 2;
        width = newWidth;
      } else if (preCropAspectRatio < canvasAspectRatio) {
        // Crop height is too tall, adjust height
        const newHeight = width / canvasAspectRatio;
        y += (height - newHeight) / 2;
        height = newHeight;
      }
      // draw with no auto tracking
      const ctx = this.cropCanvas.getContext("2d");
      ctx?.drawImage(
        this.preCropCanvas,
        x, // The x-coordinate on the source video (left) where to start cropping
        y, // The y-coordinate on the source video (top) where to start cropping
        width, // The width of the rectangle to be cropped from the source video
        height, // The height of the rectangle to be cropped from the source video
        0, // The x-coordinate on the cropCanvas where the cropped image should be placed
        0, // The y-coordinate on the cropCanvas where the cropped image should be placed
        this.cropCanvas.width, // The width to which the cropped image should be scaled
        this.cropCanvas.height, // The height to which the cropped image should be scaled
      );
    }
  }

  preCropVideo(currentTimecode: number) {
    let y = 0;
    let x = 0;
    let w = this.srcWidth;
    let h = this.srcHeight;

    if (this.manualCropActive) {
      // object-view-box: inset(20% 0% 10% 22%);
      const currentCropIndex = getCurrentCropIndex(
        this.manualCrop,
        currentTimecode,
        this.startTimecode,
      );
      const currentCrop = this.manualCrop?.[currentCropIndex];
      const insetTop = (currentCrop?.top ?? 0) / 100;
      const insetRight = (currentCrop?.right ?? 0) / 100;
      const insetBottom = (currentCrop?.bottom ?? 0) / 100;
      const insetLeft = (currentCrop?.left ?? 0) / 100;
      x = w * insetLeft;
      y = h * insetTop;
      w = w * (1 - insetLeft - insetRight);
      h = h * (1 - insetTop - insetBottom);
      const croppedAspectRatio = w / h;

      // Adjust the crop dimensions to match the preCropCanvas aspect ratio
      const canvasAspectRatio = this.preCropCanvas.width /
        this.preCropCanvas.height;
      if (croppedAspectRatio > canvasAspectRatio) {
        // Crop width is too wide, adjust width
        const newWidth = h * canvasAspectRatio;
        x += (w - newWidth) / 2;
        w = newWidth;
      } else if (croppedAspectRatio < canvasAspectRatio) {
        // Crop height is too tall, adjust height
        const newHeight = w / canvasAspectRatio;
        y += (h - newHeight) / 2;
        h = newHeight;
      }
    }

    const ctx = this.preCropCanvas.getContext("2d");
    ctx?.drawImage(
      this.srcVideoElement,
      x, // The x-coordinate on the source video (left) where to start cropping
      y, // The y-coordinate on the source video (top) where to start cropping
      w, // The width of the rectangle to be cropped from the source video
      h, // The height of the rectangle to be cropped from the source video
      0, // The x-coordinate on the cropCanvas where the cropped image should be placed
      0, // The y-coordinate on the cropCanvas where the cropped image should be placed
      this.preCropCanvas.width, // The width to which the cropped image should be scaled
      this.preCropCanvas.height, // The height to which the cropped image should be scaled
    );
  }

  private async setupVideoRendering() {
    if (!this.comp) {
      this.comp = await import(
        "/resources/dev_bf.bundle.js"
      );
    }
    if (!this.detector && (this.settings.useTracking) && ENABLE_TRACKING) {
      // await tfjsReady();
      const detectorConfig = {
        runtime: "tfjs",
        modelType: TensorFlowPoseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose`,
        enableSmoothing: true,
        // enableTracking: true,
        // minPoseScore: 0.5,
        // multiPoseMaxDimension: 1920,
      } as TensorFlowPoseDetection.MoveNetModelConfig;
      this.detector = await TensorFlowPoseDetection.createDetector(
        TensorFlowPoseDetection.SupportedModels.MoveNet,
        detectorConfig,
      );
      // warm up detector
      const srcCtx = this.srcCanvas.getContext("2d");
      srcCtx?.drawImage(this.preCropCanvas, 0, 0);
      await this.detector.estimatePoses(this.srcCanvas);
    }
    this.compApi = await this.comp.startDOMOutputAsync(
      this.rootElement,
      this.outputWidth,
      this.outputHeight,
      {
        videoSlots: [
          { element: this.streamVideoElement, id: "video1" },
        ],
        assetImages: [],
      },
      {
        getAssetUrlCb,
      },
    );
    const words = JSON.stringify(this.transcriptWords);
    this.compApi.setParamValue("transcriptWords", words);
    this.compApi.setParamValue("startTimecode", this.startTimecode);
    this.compApi.setParamValue("endTimecode", this.endTimecode);
    this.compApi.setParamValue("settings", JSON.stringify(this.settings));
    this.compApi.setParamValue("title", this.title);
    this.compApi.setActiveVideoInputSlots([{
      id: "video1",
      active: true,
      type: "camera",
    }]);
    await this.seekVideoElements(this.startTimecode);
  }

  async setupAudioRendering() {
    const response = await fetch(this.videoUrl);
    const blob = await response.blob();
    const file = new File([blob], "bf-clip.mp4");

    const {
      encodedAudioChunks,
      sampleRate,
      numberOfChannels,
      codec,
    } = await extractEncodedAudio(
      file,
    );
    this.sampleRate = sampleRate;
    this.numberOfChannels = numberOfChannels;

    let decodedCount = 0;
    let firstTimestamp: number | null = null;
    const beginningTimecode = this.startTimecode -
      AUDIO_DECODING_BUFFER_IN_SECONDS;
    const endingTimecode = this.endTimecode + AUDIO_DECODING_BUFFER_IN_SECONDS;
    const audioDecoder = new AudioDecoder({
      output: (audioDataPart) => {
        const currentTimecode = audioDataPart.timestamp / 1000 / 1000;

        if (firstTimestamp === null) {
          firstTimestamp = currentTimecode;
        }

        const adjustedTimestamp = currentTimecode - firstTimestamp;
        const isAfterStart = adjustedTimestamp > beginningTimecode;
        const isBeforeEnd = adjustedTimestamp < endingTimecode;
        const inClip = isAfterStart && isBeforeEnd;
        if (inClip) {
          logVerbose("found clip audio data", adjustedTimestamp);
          this.audioChunks.push(audioDataPart);
        }
        decodedCount++;
        const progress = decodedCount / encodedAudioChunks.length;
        this.calculateProgress("setupAudioRendering", progress);
        if (decodedCount === encodedAudioChunks.length) {
          logVerbose("done decoding");
        }
      },
      error: (error: Error) => {
        logError(error);
      },
    });

    audioDecoder.configure({
      codec,
      numberOfChannels,
      sampleRate,
    });
    for (const chunk of encodedAudioChunks) {
      if (this.cancelRequested) {
        return;
      }
      audioDecoder.decode(chunk);
    }

    await audioDecoder.flush();
  }

  async seekVideoElements(currentTimecode: number) {
    const srcPromise = new Promise<void>((resolve) => {
      this.srcVideoElement.addEventListener("seeked", () => {
        return resolve();
      }, { once: true });
      this.srcVideoElement.currentTime = currentTimecode;
    });

    await srcPromise;
  }

  async renderFrame(currentTimecode: number, frameNumber: number) {
    if (this.cancelRequested) {
      this.clearFrames();
      return null;
    }
    const stopSeekTimer = this.perfLogger.log("seekVideoElements");
    await this.seekVideoElements(currentTimecode);
    stopSeekTimer();

    this.preCropVideo(currentTimecode);
    await this.autoFrameAndCrop();

    const stopVcsTimer = this.perfLogger.log("vcs");
    this.compApi.renderFrame(currentTimecode);
    stopVcsTimer();

    const stopEncoderTimer = this.perfLogger.log("videoFrame");
    // super hacky so first frame isn't red... duplicates the first frame
    let frameToRender = this.compApi.fgCanvas;
    if (
      (this.settings.useTracking || this.manualCropActive) &&
      frameNumber === 0 &&
      this.featureFlags.enableRedFrameHack === true
    ) {
      frameToRender = this.cropCanvas;
    }
    const frame = new VideoFrame(frameToRender, {
      timestamp: frameNumber * 1000 * 1000 / this.fps,
    });
    stopEncoderTimer();
    return frame;
  }

  calculateProgress(tag: string, number: number) {
    if (this.cancelRequested) {
      this.progressCallback(undefined);
      return;
    }
    const steps = [
      { name: "setupAudioRendering", weight: 1 },
      { name: "renderFrame", weight: 80 },
      { name: "audio", weight: 10 },
      { name: "video", weight: 10 },
    ];

    this.renderingProgress[tag] = number;

    let weightedSum = 0;
    let totalWeight = 0;

    steps.forEach((step) => {
      const progress = this.renderingProgress[step.name] || 0;
      weightedSum += (progress * step.weight) / 100; // Adjust here: consider individual progress as part of the whole
      totalWeight += step.weight;
    });

    this.progressCallback(Math.min(weightedSum * 100, 100)); // Adjust here: now currentProgress is a ratio, so multiply by 100 to get percentage
  }

  async startOfflineRender(
    progressCallback: (progress?: number) => void,
  ): Promise<File | null> {
    this.progressCallback = progressCallback;
    const stopOfflineRenderTimer = this.perfLogger.log("totalOfflineRender");
    const stopLoadedPerf = this.perfLogger.log("everythingIsReady");
    try {
      await this.dataIsLoaded;
      await this.compositionIsLoaded;
    } catch (e) {
      // deno-lint-ignore no-console
      console.log("error loading data", e);
      throw e;
    }
    stopLoadedPerf();

    logVerbose("Starting offline render");
    const promise = new Promise<void>((resolve, reject) => {
      let currentFrame = 0;
      let currentTime = this.startTimecode - 1 / this.fps;
      const renderNextFrame = () => {
        const stopRenderFrame = this.perfLogger.log("renderFrame");
        if (this.cancelRequested) {
          this.clearFrames();
          reject("Render cancelled");
          return;
        }
        if (currentTime < (this.endTimecode + this.endCapLength)) {
          setTimeout(async () => {
            const frame = await this.renderFrame(currentTime, currentFrame);
            if (frame === null) {
              resolve();
              return;
            }
            this.videoFrames.push(frame);
            currentFrame++;
            currentTime += 1 / this.fps;
            this.calculateProgress(
              "renderFrame",
              currentTime / (this.endTimecode + this.endCapLength),
            );
            stopRenderFrame();
            renderNextFrame();
          }, 0 / this.fps);
        } else {
          this.calculateProgress("renderFrame", 1);
          resolve();
        }
      };
      logVerbose("Starting render");
      renderNextFrame();
    });
    await promise;
    if (this.cancelRequested) {
      this.clearFrames();
      return null;
    }
    const stopAudioPerf = this.perfLogger.log("finishingFile");
    const file = await this.finish();
    stopAudioPerf();
    stopOfflineRenderTimer();
    this.reportPerflogVerbose();
    return file;
  }

  reportPerflogVerbose() {
    const output = this.perfLogger.report();
    // deno-lint-ignore no-console
    console.table(output);
    captureEvent("clip", "render_perf", output);
  }

  async everythingIsReady() {
    await this.dataIsLoaded;
    await this.compositionIsLoaded;
    await this.audioIsLoaded;
  }

  async finish(): Promise<File> {
    logVerbose("Finishing");
    await this.everythingIsReady();
    logVerbose(this.videoFrames.length, this.audioChunks.length);
    const file = await createMuxedFile({
      input: {
        audio: {
          audioChunks: this.audioChunks,
          numberOfChannels: this.numberOfChannels,
          sampleRate: this.sampleRate,
        },
        video: {
          videoFrames: this.videoFrames,
          width: this.outputWidth,
          height: this.outputHeight,
        },
      },
      output: {
        video: {
          width: this.outputWidth,
          height: this.outputHeight,
        },
        audio: {
          numberOfChannels: this.numberOfChannels,
          sampleRate: this.sampleRate,
        },
      },
      events: {
        onAudioProgress: (progress) => {
          this.calculateProgress("audio", progress);
        },
        onVideoProgress: (progress) => {
          this.calculateProgress("video", progress);
        },
        onComplete: () => {
          this.calculateProgress("audio", 1);
          this.calculateProgress("video", 1);
        },
      },
    });
    this.clearFrames();
    if (this.settings.useTracking || this.manualCropActive) {
      this.srcCanvas.remove();
      this.cropCanvas.remove();
    }
    return file;
  }
}
