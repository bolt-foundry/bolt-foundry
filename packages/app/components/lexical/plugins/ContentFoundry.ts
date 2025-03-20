/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { LexicalEditor } from "lexical";

import { useEffect, useState } from "react";

export type Sample = {
  author: string;
  content: string;
  deleted: boolean;
  id: string;
  timeStamp: number;
  type: "sample";
  rating: number;
};

export type Thread = {
  samples: Array<Sample>;
  id: string;
  quote: string;
  type: "thread";
};

export type Samples = Array<Thread | Sample>;

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .slice(0, 5);
}

export function createSample(
  content: string,
  rating: number = 3,
  author: string,
  id?: string,
  timeStamp?: number,
  deleted?: boolean,
): Sample {
  return {
    author,
    content,
    deleted: deleted === undefined ? false : deleted,
    id: id === undefined ? createUID() : id,
    timeStamp: timeStamp === undefined ? performance.now() : timeStamp,
    type: "sample",
    rating,
  };
}

export function createThread(
  quote: string,
  samples: Array<Sample>,
  id?: string,
): Thread {
  return {
    samples,
    id: id === undefined ? createUID() : id,
    quote,
    type: "thread",
  };
}

function cloneThread(thread: Thread): Thread {
  return {
    samples: Array.from(thread.samples),
    id: thread.id,
    quote: thread.quote,
    type: "thread",
  };
}

function markDeleted(sample: Sample): Sample {
  return {
    author: sample.author,
    content: "[Deleted sample]",
    deleted: true,
    id: sample.id,
    timeStamp: sample.timeStamp,
    type: "sample",
    rating: sample.rating,
  };
}

function triggerOnChange(sampleStore: SampleStore): void {
  const listeners = sampleStore._changeListeners;
  for (const listener of listeners) {
    listener();
  }
}

export class SampleStore {
  _editor: LexicalEditor;
  _samples: Samples;
  _changeListeners: Set<() => void>;

  constructor(editor: LexicalEditor) {
    this._samples = [];
    this._editor = editor;
    this._changeListeners = new Set();
  }

  getSamples(): Samples {
    return this._samples;
  }

  addSample(
    sampleOrThread: Sample | Thread,
    thread?: Thread,
    offset?: number,
  ): void {
    const nextSamples = Array.from(this._samples);

    if (thread !== undefined && sampleOrThread.type === "sample") {
      for (let i = 0; i < nextSamples.length; i++) {
        const sample = nextSamples[i];
        if (sample.type === "thread" && sample.id === thread.id) {
          const newThread = cloneThread(sample);
          nextSamples.splice(i, 1, newThread);
          const insertOffset = offset !== undefined
            ? offset
            : newThread.samples.length;
          newThread.samples.splice(insertOffset, 0, sampleOrThread);
          break;
        }
      }
    } else {
      const insertOffset = offset !== undefined ? offset : nextSamples.length;
      nextSamples.splice(insertOffset, 0, sampleOrThread);
    }
    this._samples = nextSamples;
    triggerOnChange(this);
  }

  deleteSampleOrThread(
    sampleOrThread: Sample | Thread,
    thread?: Thread,
  ): { markedSample: Sample; index: number } | null {
    const nextSamples = Array.from(this._samples);
    let sampleIndex: number | null = null;

    if (thread !== undefined) {
      for (let i = 0; i < nextSamples.length; i++) {
        const nextSample = nextSamples[i];
        if (nextSample.type === "thread" && nextSample.id === thread.id) {
          const newThread = cloneThread(nextSample);
          nextSamples.splice(i, 1, newThread);
          const threadSamples = newThread.samples;
          sampleIndex = threadSamples.indexOf(sampleOrThread as Sample);
          threadSamples.splice(sampleIndex, 1);
          break;
        }
      }
    } else {
      sampleIndex = nextSamples.indexOf(sampleOrThread);
      nextSamples.splice(sampleIndex, 1);
    }
    this._samples = nextSamples;
    triggerOnChange(this);

    if (sampleOrThread.type === "sample") {
      return {
        index: sampleIndex as number,
        markedSample: markDeleted(sampleOrThread as Sample),
      };
    }

    return null;
  }

  registerOnChange(onChange: () => void): () => void {
    const changeListeners = this._changeListeners;
    changeListeners.add(onChange);
    return () => {
      changeListeners.delete(onChange);
    };
  }
}

export function useSampleStore(sampleStore: SampleStore): Samples {
  const [samples, setSamples] = useState<Samples>(
    sampleStore.getSamples(),
  );

  useEffect(() => {
    return sampleStore.registerOnChange(() => {
      setSamples(sampleStore.getSamples());
    });
  }, [sampleStore]);

  return samples;
}
