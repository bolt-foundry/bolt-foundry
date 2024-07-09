import { getLogger, rxjs } from "deps.ts";

const logger = getLogger(import.meta);
logger.setLevel("info");

function isTransferrable(value: unknown): boolean {
  const knownTransferrables = [
    "ArrayBuffer",
    "MessagePort",
    "ReadableStream",
    "WritableStream",
    "TransformStream",
    "AudioData",
    "Blob",
    "ImageBitmap",
    "OffscreenCanvas",
    "VideoFrame",
    "RTCDataChannel",
  ];
  return knownTransferrables.some((transferable) => {
    const globalValue = (globalThis as any)[transferable];
    const typeofValue = typeof value;
    return typeofValue === "object" && globalValue === value;
  });
}

function isMainScript(): boolean {
  // deno
  if (import.meta.main) {
    return import.meta.main;
  }
  // browser main thread
  if (typeof document !== "undefined" && document.currentScript) {
    const currentScript = document.currentScript as HTMLScriptElement;
    return (
      (currentScript.src && currentScript.src === window.location.href) ||
      !currentScript.src
    );
  }
  // browser worker
  if (typeof self.importScripts !== "undefined") {
    return true;
  }
  return false;
}

export enum WorkerKind {
  Dedicated = "Dedicated",
  Shared = "Shared",
}

export type WorkerEvent<TData = unknown> = {
  name: string;
  data: TData;
};

export type MethodCall = {
  type: "call";
  method: string;
  args: unknown[];
  ports: {
    complete: MessagePort;
    error: MessagePort;
    next: MessagePort;
  };
};

abstract class BfWorker<TEvents extends WorkerEvent = WorkerEvent> {
  static defaultWorkerKind = WorkerKind.Shared;
  static workerPath: string;
  static isMainScript = isMainScript;
  static mainInstance: BfWorker;
  workerKind = (this.constructor as typeof BfWorker).defaultWorkerKind;

  private worker: Worker | SharedWorker | null = null;

  protected static registerWorker(
    WorkerClass: typeof BfWorker,
    workerPath: string,
  ) {
    this.workerPath = workerPath;
    if (this.isMainScript()) {
      // @ts-expect-error this isn't really an error
      this.mainInstance = new WorkerClass();
    }
  }

  constructor(shouldTryToUseSharedWorkers = true) {
    const preferredWorkerKind = shouldTryToUseSharedWorkers
      ? WorkerKind.Shared
      : WorkerKind.Dedicated;
    if (!(this.constructor as typeof BfWorker).workerPath) {
      throw new Error(
        "Worker path not set. Please call registerWorker() in the static initializer before constructing the worker.",
      );
    }
    this.workerKind = preferredWorkerKind ?? this.workerKind;
    if (
      this.workerKind === WorkerKind.Shared &&
      typeof SharedWorker === "undefined"
    ) {
      this.workerKind = WorkerKind.Dedicated;
    }
    if (!isMainScript()) {
      logger.debug("Creating proxy");
      return this.createProxy();
    } else {
      logger.debug("Creating instance");
      if (this.isSharedWorker()) {
        this.setupOnConnectHandler();
      } else if (this.isDedicatedWorker()) {
        this.setupOnMessageHandler();
      }
    }
  }

  private createProxy() {
    const thisConstructor = this.constructor as typeof BfWorker;
    const workerUrl = import.meta.url
      ? new URL(import.meta.resolve(thisConstructor.workerPath))
      : new URL(thisConstructor.workerPath, import.meta.url);

    logger.debug("Creating worker with URL:", workerUrl);

    try {
      if (this.workerKind === WorkerKind.Shared) {
        this.worker = new SharedWorker(workerUrl, {
          type: "module",
        });
        logger.debug("SharedWorker created:", this.worker);
      } else {
        this.worker = new Worker(workerUrl, {
          type: "module",
        });
        logger.debug("Dedicated Worker created:", this.worker);
      }
    } catch (error) {
      this.handleWorkerInitializationError(error);
      throw error;
    }

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (
          typeof prop === "string" &&
          // deno-lint-ignore no-explicit-any
          typeof (target as any)[prop] === "function"
        ) {
          return (...args: unknown[]) => {
            logger.debug("Proxying method call:", prop, "with args:", args);
            const completeChannel = new MessageChannel();
            const errorChannel = new MessageChannel();
            const nextChannel = new MessageChannel();
            const ports = {
              complete: completeChannel.port2,
              error: errorChannel.port2,
              next: nextChannel.port2,
            };

            const transferrableArgs = args.filter(isTransferrable);
            logger.debug("Transferrable args:", transferrableArgs);
            const transferrables = [
              ...Object.values(ports),
              ...transferrableArgs,
            ];

            const messageBody: MethodCall = {
              type: "call",
              method: prop,
              args,
              ports: ports,
            };

            logger.debug("Posting message to worker:", messageBody);
            logger.debug("Transferrables:", transferrables);

            if (this.worker instanceof Worker) {
              // @ts-expect-error idk why this is so weirdly typed
              this.worker.postMessage(messageBody, transferrables);
            }

            if (
              typeof SharedWorker !== "undefined" &&
              this.worker instanceof SharedWorker
            ) {
              // @ts-expect-error idk why this is so weirdly typed
              this.worker.port.postMessage(messageBody, transferrables);
            }

            const returnable = this.handleMethodReturnType(
              completeChannel,
              errorChannel,
              nextChannel,
            );
            logger.debug("Returnable:", returnable);

            return returnable;
          };
        }
        logger.debug("Reflecting");
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  private handleWorkerInitializationError(error: unknown) {
    logger.error("Worker initialization failed:", error);
  }

  private setupMessageHandler(port?: MessagePort) {
    const target = port || self;
    target.onmessage = (...args) => (this.handleMessage(...args));
    logger.debug("Worker message handler setup", this);
  }

  private async handleMessage(event: MessageEvent<MethodCall>) {
    logger.debug("Received message:", event.data);
    const { method, args, ports } = event.data;
    const { complete, error, next } = ports;
    logger.debug("Message method:", method);
    logger.debug("Message args:", args);
    logger.debug("Message ports:", ports);
    try {
      // deno-lint-ignore no-explicit-any
      const methodFunction = (this as any)[method];
      if (typeof methodFunction === "function") {
        const result = methodFunction(...args);
        if (result instanceof Promise) {
          const resolvedValue = await result;
          logger.debug("Promise resolved with value:", resolvedValue);
          next.postMessage(resolvedValue); // Send data to next port
          complete.postMessage(resolvedValue); // Send data to complete port
          complete.close();
          next.close();
        } else if (result && typeof result.subscribe === "function") {
          logger.debug("Result is an observable");
          result.subscribe({
            next: (value: unknown) => {
              logger.debug("Observable next value:", value);
              next.postMessage(value);
            },
            error: (err: unknown) => {
              logger.debug("Observable error:", err);
              error.postMessage(err);
              error.close();
            },
            complete: () => {
              logger.debug("Observable complete");
              complete.postMessage(undefined);
              complete.close();
            },
          });
        } else {
          logger.debug("Result is:", result);
          next.postMessage(result); // Send data to next port
          next.close();
          complete.postMessage(result);
          complete.close();
        }
      } else {
        logger.debug("Method function not found or not callable");
        throw new Error(`Method function not found or not callable: ${method}`);
      }
    } catch (err) {
      logger.debug("Error occurred:", err);
      error.postMessage(err);
      error.close();
    }
  }

  private setupOnConnectHandler() {
    onconnect = (event: MessageEvent) => {
      const port = event.ports[0];
      this.setupMessageHandler(port);
    };
  }

  private setupOnMessageHandler() {
    this.setupMessageHandler();
  }

  protected isDedicatedWorker(): boolean {
    return (
      typeof WorkerGlobalScope !== "undefined" &&
      self instanceof WorkerGlobalScope &&
      !(typeof SharedWorkerGlobalScope !== "undefined" &&
        self instanceof SharedWorkerGlobalScope)
    );
  }

  protected isSharedWorker(): boolean {
    return (
      typeof WorkerGlobalScope !== "undefined" &&
      self instanceof WorkerGlobalScope &&
      typeof SharedWorkerGlobalScope !== "undefined" &&
      self instanceof SharedWorkerGlobalScope
    );
  }

  protected abstract handleMethodReturnType(
    completeChannel: MessageChannel,
    errorChannel: MessageChannel,
    nextChannel: MessageChannel,
  ): unknown;
}

export abstract class BfWorkerPromise<TEvents extends WorkerEvent = WorkerEvent>
  extends BfWorker<TEvents> {
  protected handleMethodReturnType(
    completeChannel: MessageChannel,
    errorChannel: MessageChannel,
    nextChannel: MessageChannel,
  ): Promise<TEvents["data"]> {
    logger.debug("Returning promise");
    return new Promise((resolve, reject) => {
      completeChannel.port1.onmessage = (event) => resolve(event.data);
      nextChannel.port1.onmessage = (event) => resolve(event.data);
      errorChannel.port1.onmessage = (event) => reject(event.data);
    });
  }
}

export abstract class BfWorkerObservable<
  TEvents extends WorkerEvent = WorkerEvent,
> extends BfWorker<TEvents> {
  protected handleMethodReturnType(
    completeChannel: MessageChannel,
    errorChannel: MessageChannel,
    nextChannel: MessageChannel,
  ): rxjs.Observable<TEvents["data"]> {
    return new rxjs.Observable((subscriber) => {
      nextChannel.port1.onmessage = (event) => subscriber.next(event.data);
      errorChannel.port1.onmessage = (event) => subscriber.error(event.data);
      completeChannel.port1.onmessage = () => subscriber.complete();
    });
  }
}
