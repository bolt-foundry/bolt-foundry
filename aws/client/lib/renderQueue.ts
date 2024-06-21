import { DGWord } from "aws/types/transcript.ts";
import BFRenderer from "aws/client/lib/BFRenderer.ts";
import { addFile } from "aws/client/relay/localResolvers/ProjectResolver.ts";
import { captureEvent } from "aws/events/mod.ts";
import type { Maybe } from "aws/client/deps.ts";
import { RenderSettings } from "aws/types/settings.ts";
import { type ManualCrop } from "aws/client/components/ManualCropMenu.tsx";

type QueueRenderParams = {
  videoUrl: string;
  transcriptWords: Array<DGWord>;
  startTime: number;
  endTime: number;
  clipId: string;
  featureFlags: Record<string, boolean>;
  settings: RenderSettings;
  personId: string;
  manualCrop: Array<ManualCrop>;
  manualCropActive: boolean;
  title: string;
};
type QueueResponse = Promise<File>;
type QueueItem = {
  clipId: string;
  videoUrl: string;
  resolver: (value: File) => void;
  rejector: (reason?: unknown) => unknown;
  promise: Promise<unknown>;
  status: "pending" | "rendering" | "complete" | "error";
  startTime: number;
  endTime: number;
  transcriptWords: Array<DGWord>;
  featureFlags: Record<string, boolean>;
  settings: RenderSettings;
  events: {
    start: () => void;
    progress: (progress: number) => void;
    complete: () => void;
    cancel?: () => void;
  };
  personId: string;
  manualCrop: Array<ManualCrop>;
  manualCropActive: boolean;
  title: string;
};

const queue: Array<QueueItem> = [];
const completedItems: Record<string, File> = {};
const itemProgress: Record<string, number | undefined> = {};

const defaultEvents = {
  start: () => {},
  progress: () => {},
  complete: () => {},
};
export function queueRender({
  videoUrl,
  transcriptWords,
  startTime,
  endTime,
  clipId,
  featureFlags,
  settings,
  personId,
  manualCrop,
  manualCropActive,
  title,
}: QueueRenderParams): QueueResponse {
  let resolver;
  let rejector;
  const allEvents = { ...defaultEvents, ...events };
  const promise = new Promise<File>((resolve, reject) => {
    resolver = resolve;
    rejector = reject;
  });
  const item: QueueItem = {
    clipId,
    videoUrl,
    resolver: resolver!,
    rejector: rejector!,
    promise,
    status: "pending",
    startTime,
    endTime,
    transcriptWords,
    featureFlags,
    settings,
    events: allEvents,
    personId,
    manualCrop,
    manualCropActive,
    title,
  };
  queue.push(item);
  captureEvent("clip", "queued", { settings }, personId);
  const progressEvent = (progress: number) => {
    const eventsArray = events[item.clipId];
    if (!eventsArray) {
      return;
    }
    eventsArray.forEach((event) => {
      if (event.setProgress) {
        event.setProgress(progress);
      }
    });
  };
  progressEvent(0.001);
  if (queueStatus === "idle") {
    processQueue();
  }
  return promise;
}

const events: Record<
  string,
  Array<{
    setProgress?: (progress?: number) => void;
    setDownloadableFile?: (file: File) => void;
    cancel?: () => void;
  }>
> = {};

export function clearEvents(clipId: Maybe<string>) {
  if (!clipId) {
    return;
  }
  delete completedItems[clipId];
  delete itemProgress[clipId];
}

export function cancelRender(clipId: Maybe<string>) {
  if (!clipId) {
    return;
  }
  const clipEvents = events[clipId];
  if (clipEvents) {
    // For each event registered for this clipId, call the cancel function if it exists
    clipEvents.forEach((event) => {
      if (typeof event.cancel === "function") {
        event.cancel();
      }
    });
  }
  // find the item in the queue by clipId and remove it
  const itemIndex = queue.findIndex((item) => item.clipId === clipId);
  if (itemIndex !== -1) {
    queue.splice(itemIndex, 1);
  }
  clearEvents(clipId);
}

export function registerEvents(
  clipId: string,
  { setProgress, setDownloadableFile }: {
    setProgress?: (progress?: number) => void;
    setDownloadableFile?: (file: File) => void;
  },
) {
  if (!events[clipId]) {
    events[clipId] = [];
  }
  events[clipId].push({
    setProgress,
    setDownloadableFile,
    cancel: undefined,
  });
  setDownloadableFile?.(completedItems[clipId]);
  setProgress?.(itemProgress[clipId]);
}

let queueStatus: "idle" | "processing" = "idle";

async function processQueue() {
  const nextItem = queue.shift();
  if (!nextItem) {
    queueStatus = "idle";
    return;
  }
  queueStatus = "processing";
  await startRender(nextItem);
  setTimeout(processQueue, 0);
}

async function startRender(item: QueueItem) {
  item.status = "rendering";
  try {
    const result = await renderItem(item);
    item.status = "complete";
    item.resolver(result);
  } catch (e) {
    item.status = "error";
    item.rejector(e);
  }
}

async function renderItem(item: QueueItem): Promise<File> {
  const progressEvent = (progress?: number) => {
    const eventsArray = events[item.clipId];
    if (!eventsArray) {
      return;
    }
    eventsArray.forEach((event) => {
      if (event.setProgress) {
        event.setProgress(progress);
      }
    });
    itemProgress[item.clipId] = progress;
  };
  const downloadableFileEvent = (file: File) => {
    const eventsArray = events[item.clipId];
    if (!eventsArray) {
      return;
    }
    eventsArray.forEach((event) => {
      if (event.setDownloadableFile) {
        event.setDownloadableFile(file);
      }
    });
    completedItems[item.clipId] = file;
  };
  const completedItem = completedItems[item.clipId];
  if (completedItem) {
    downloadableFileEvent(completedItem);
    progressEvent(100);
    return completedItem;
  }
  const {
    transcriptWords,
    videoUrl,
    startTime,
    endTime,
    featureFlags,
    settings,
    personId,
    manualCrop,
    manualCropActive,
    title,
  } = item;
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);

  let width = 1920;
  let height = 1920;
  if (settings.ratio < 1) { // tall, set width
    width = 1080;
  } else if (settings.ratio > 1) { // wide, set height
    height = 1080;
  }

  const rendererParams = {
    height,
    width,
    startTimecode: startTime,
    endTimecode: endTime,
    rootElement,
    videoUrl,
    fps: 30,
    transcriptWords,
    featureFlags,
    settings,
    manualCrop,
    manualCropActive,
    title,
  };

  const bfRenderer = new BFRenderer(rendererParams);
  // Add a cancel method to the events for this clipId
  const cancel = () => bfRenderer.cancel();
  const eventsArray = events[item.clipId];
  if (!eventsArray) {
    events[item.clipId] = [];
  }
  events[item.clipId].forEach((event) => {
    event.cancel = cancel;
  });

  captureEvent("clip", "rendering", { settings }, personId);
  try {
    const file = await bfRenderer.startOfflineRender(progressEvent);
    if (file === null) {
      return Promise.reject("Render cancelled");
    }
    captureEvent("clip", "rendered", { settings }, personId);
    addFile(file);
    downloadableFileEvent(file);
    return file;
  } catch (e) {
    captureEvent("clip", "render_error", { settings }, personId);
    throw e;
  }
}
