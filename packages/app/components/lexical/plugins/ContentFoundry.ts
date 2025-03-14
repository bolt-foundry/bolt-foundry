/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { LexicalEditor } from "lexical";

import { useEffect, useState } from "react";

export type Example = {
  author: string;
  content: string;
  deleted: boolean;
  id: string;
  timeStamp: number;
  type: "example";
  validity: "valid" | "invalid";
};

export type Thread = {
  examples: Array<Example>;
  id: string;
  quote: string;
  type: "thread";
};

export type Examples = Array<Thread | Example>;

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .slice(0, 5);
}

export function createExample(
  content: string,
  validity: "valid" | "invalid" = "valid",
  author: string,
  id?: string,
  timeStamp?: number,
  deleted?: boolean,
): Example {
  return {
    author,
    content,
    deleted: deleted === undefined ? false : deleted,
    id: id === undefined ? createUID() : id,
    timeStamp: timeStamp === undefined ? performance.now() : timeStamp,
    type: "example",
    validity,
  };
}

export function createThread(
  quote: string,
  examples: Array<Example>,
  id?: string,
): Thread {
  return {
    examples,
    id: id === undefined ? createUID() : id,
    quote,
    type: "thread",
  };
}

function cloneThread(thread: Thread): Thread {
  return {
    examples: Array.from(thread.examples),
    id: thread.id,
    quote: thread.quote,
    type: "thread",
  };
}

function markDeleted(example: Example): Example {
  return {
    author: example.author,
    content: "[Deleted example]",
    deleted: true,
    id: example.id,
    timeStamp: example.timeStamp,
    type: "example",
    validity: example.validity,
  };
}

function triggerOnChange(exampleStore: ExampleStore): void {
  const listeners = exampleStore._changeListeners;
  for (const listener of listeners) {
    listener();
  }
}

export class ExampleStore {
  _editor: LexicalEditor;
  _examples: Examples;
  _changeListeners: Set<() => void>;

  constructor(editor: LexicalEditor) {
    this._examples = [];
    this._editor = editor;
    this._changeListeners = new Set();
  }

  getExamples(): Examples {
    return this._examples;
  }

  addExample(
    exampleOrThread: Example | Thread,
    thread?: Thread,
    offset?: number,
  ): void {
    const nextExamples = Array.from(this._examples);

    if (thread !== undefined && exampleOrThread.type === "example") {
      for (let i = 0; i < nextExamples.length; i++) {
        const example = nextExamples[i];
        if (example.type === "thread" && example.id === thread.id) {
          const newThread = cloneThread(example);
          nextExamples.splice(i, 1, newThread);
          const insertOffset = offset !== undefined
            ? offset
            : newThread.examples.length;
          newThread.examples.splice(insertOffset, 0, exampleOrThread);
          break;
        }
      }
    } else {
      const insertOffset = offset !== undefined ? offset : nextExamples.length;
      nextExamples.splice(insertOffset, 0, exampleOrThread);
    }
    this._examples = nextExamples;
    triggerOnChange(this);
  }

  deleteExampleOrThread(
    exampleOrThread: Example | Thread,
    thread?: Thread,
  ): { markedExample: Example; index: number } | null {
    const nextExamples = Array.from(this._examples);
    let exampleIndex: number | null = null;

    if (thread !== undefined) {
      for (let i = 0; i < nextExamples.length; i++) {
        const nextExample = nextExamples[i];
        if (nextExample.type === "thread" && nextExample.id === thread.id) {
          const newThread = cloneThread(nextExample);
          nextExamples.splice(i, 1, newThread);
          const threadExamples = newThread.examples;
          exampleIndex = threadExamples.indexOf(exampleOrThread as Example);
          threadExamples.splice(exampleIndex, 1);
          break;
        }
      }
    } else {
      exampleIndex = nextExamples.indexOf(exampleOrThread);
      nextExamples.splice(exampleIndex, 1);
    }
    this._examples = nextExamples;
    triggerOnChange(this);

    if (exampleOrThread.type === "example") {
      return {
        index: exampleIndex as number,
        markedExample: markDeleted(exampleOrThread as Example),
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

export function useExampleStore(exampleStore: ExampleStore): Examples {
  const [examples, setExamples] = useState<Examples>(
    exampleStore.getExamples(),
  );

  useEffect(() => {
    return exampleStore.registerOnChange(() => {
      setExamples(exampleStore.getExamples());
    });
  }, [exampleStore]);

  return examples;
}
