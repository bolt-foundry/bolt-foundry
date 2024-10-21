import {
  BfWorkerObservable,
  BfWorkerPromise,
} from "packages/bfWorker/BfWorker.ts";

import rxjs from "rxjs";

const { of } = rxjs;

class _BfWorkerExamplePromise extends BfWorkerPromise {
  static {
    this.registerWorker(this, "/packages/bfWorker/BfWorkerExample.ts");
  }

  // A method that returns a regular value, should show a typescript error
  public returnValue(num: number): number {
    return num * 2;
  }

  // A method that returns a Promise, should not show a typescript error
  public returnPromise(text: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Resolved: ${text}`);
      }, 1000);
    });
  }

  // A method that returns an Observable, should show a typescript error
  public returnObservable(items: string[]): rxjs.Observable<string> {
    return of(...items);
  }
}

type UploadEvent = {
  event: "uploadProgress";
  progress: number;
};

class _ExampleUploader extends BfWorkerObservable {
  static {
    this.registerWorker(this, "/packages/bfWorker/BfWorkerExample.ts");
  }

  public upload(_file: File): rxjs.Observable<UploadEvent> {
    return new rxjs.Observable<UploadEvent>((subscriber) => {
      let progress = 0;
      const intervalId = setInterval(() => {
        progress += 10;
        subscriber.next({ event: "uploadProgress", progress });
        if (progress >= 100) {
          clearInterval(intervalId);
          subscriber.complete();
        }
      }, 200);
    });
  }
}
