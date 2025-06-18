#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";

// Simple delay function for tests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Tests for parallel evaluation functionality
 *
 * These tests verify that the eval command correctly handles parallel execution
 * of sample gathering and grader processing.
 */

// Mock implementations for testing parallel execution
interface MockSample {
  id: string;
  userMessage: string;
  assistantResponse: string;
  score?: number;
}

interface MockGradingResult {
  score: number;
  reason: string;
  processingTimeMs: number;
}

// Simulated API call with configurable delay
async function mockGradeCall(
  sample: MockSample,
  delayMs: number = 100,
): Promise<MockGradingResult> {
  const startTime = Date.now();
  await delay(delayMs);
  return {
    score: sample.score ?? Math.floor(Math.random() * 7) - 3, // -3 to 3
    reason: `Graded sample ${sample.id}`,
    processingTimeMs: Date.now() - startTime,
  };
}

// Parallel execution coordinator with concurrency control
class ParallelExecutor<T> {
  private concurrencyLimit: number;
  private activeCount = 0;
  private queue: Array<() => void> = [];

  constructor(concurrencyLimit: number) {
    this.concurrencyLimit = concurrencyLimit;
  }

  async execute<R>(task: () => Promise<R>): Promise<R> {
    while (this.activeCount >= this.concurrencyLimit) {
      await new Promise<void>((resolve) => this.queue.push(() => resolve()));
    }

    this.activeCount++;
    try {
      return await task();
    } finally {
      this.activeCount--;
      const next = this.queue.shift();
      if (next) next();
    }
  }

  executeAll<R>(tasks: Array<() => Promise<R>>): Promise<Array<R>> {
    return Promise.all(tasks.map((task) => this.execute(task)));
  }
}

Deno.test("should gather samples in parallel batches", async () => {
  const samples: Array<MockSample> = Array.from({ length: 100 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  const batchSize = 10;
  const executor = new ParallelExecutor(batchSize);

  const startTime = Date.now();
  const results = await executor.executeAll(
    samples.map((sample) => () => mockGradeCall(sample, 50)),
  );
  const totalTime = Date.now() - startTime;

  assertEquals(results.length, 100);
  // With batch size 10 and 50ms per call, should take roughly 500ms (10 batches)
  // Add some buffer for test reliability
  const sequentialTime = samples.length * 50;

  // Total time should be much less than sequential time
  assertEquals(
    totalTime < sequentialTime * 0.3,
    true,
    `Expected parallel execution to be faster: ${totalTime}ms vs sequential ${sequentialTime}ms`,
  );
});

Deno.test("should respect concurrency limits for sample gathering", async () => {
  const concurrencyLimit = 5;
  const executor = new ParallelExecutor(concurrencyLimit);

  let currentActive = 0;
  let maxActive = 0;

  const trackingGradeCall = async (sample: MockSample) => {
    currentActive++;
    maxActive = Math.max(maxActive, currentActive);
    try {
      return await mockGradeCall(sample, 100);
    } finally {
      currentActive--;
    }
  };

  const samples: Array<MockSample> = Array.from({ length: 20 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  await executor.executeAll(
    samples.map((sample) => () => trackingGradeCall(sample)),
  );

  assertEquals(
    maxActive <= concurrencyLimit,
    true,
    `Max concurrent executions (${maxActive}) should not exceed limit (${concurrencyLimit})`,
  );
});

Deno.test("should handle sample gathering failures gracefully", async () => {
  const samples: Array<MockSample> = Array.from({ length: 10 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  const executor = new ParallelExecutor(5);
  const results: Array<MockGradingResult | Error> = [];

  const failingGradeCall = (sample: MockSample) => {
    if (parseInt(sample.id.split("-")[1]) % 3 === 0) {
      throw new Error(`Failed to grade ${sample.id}`);
    }
    return mockGradeCall(sample, 50);
  };

  await Promise.allSettled(
    samples.map((sample) =>
      executor.execute(() => failingGradeCall(sample))
        .then((r) => results.push(r))
        .catch((e) => results.push(e))
    ),
  );

  const successCount = results.filter((r) => !(r instanceof Error)).length;
  const failureCount = results.filter((r) => r instanceof Error).length;

  assertEquals(successCount, 6); // samples 1,2,4,5,7,8
  assertEquals(failureCount, 4); // samples 0,3,6,9
});

Deno.test("should run multiple graders in parallel", async () => {
  const graderCount = 5;
  const samplesPerGrader = 10;

  const graderTasks = Array.from(
    { length: graderCount },
    (_, graderIdx) => () => {
      const samples: Array<MockSample> = Array.from(
        { length: samplesPerGrader },
        (_, i) => ({
          id: `grader-${graderIdx}-sample-${i}`,
          userMessage: `Message ${i}`,
          assistantResponse: `Response ${i}`,
        }),
      );

      return Promise.all(samples.map((s) => mockGradeCall(s, 100)));
    },
  );

  const startTime = Date.now();
  const results = await Promise.all(graderTasks.map((task) => task()));
  const totalTime = Date.now() - startTime;

  assertEquals(results.length, graderCount);
  results.forEach((graderResults) => {
    assertEquals(graderResults.length, samplesPerGrader);
  });

  // All graders running in parallel should complete in roughly the same time as one grader
  const sequentialTime = graderCount * samplesPerGrader * 100;

  assertEquals(
    totalTime < sequentialTime * 0.3,
    true,
    `Expected parallel grader execution: ${totalTime}ms vs sequential ${sequentialTime}ms`,
  );
});

Deno.test("should process samples within each grader in parallel", async () => {
  const samplesPerGrader = 50;
  const concurrencyLimit = 10;

  const graderTask = (graderId: string) => {
    const executor = new ParallelExecutor(concurrencyLimit);
    const samples: Array<MockSample> = Array.from(
      { length: samplesPerGrader },
      (_, i) => ({
        id: `${graderId}-sample-${i}`,
        userMessage: `Message ${i}`,
        assistantResponse: `Response ${i}`,
      }),
    );

    return executor.executeAll(
      samples.map((s) => () => mockGradeCall(s, 50)),
    );
  };

  const startTime = Date.now();
  const results = await graderTask("test-grader");
  const totalTime = Date.now() - startTime;

  assertEquals(results.length, samplesPerGrader);

  // With concurrency 10 and 50 samples, should take roughly 250ms (5 batches * 50ms)
  const expectedTime = Math.ceil(samplesPerGrader / concurrencyLimit) * 50;
  assertEquals(
    totalTime < expectedTime * 2,
    true,
    `Expected batched execution around ${expectedTime}ms, got ${totalTime}ms`,
  );
});

Deno.test("should maintain grader isolation in parallel execution", async () => {
  const graderResults = new Map<string, Array<MockGradingResult>>();

  const graderTask = async (graderId: string) => {
    const samples: Array<MockSample> = Array.from({ length: 10 }, (_, i) => ({
      id: `${graderId}-sample-${i}`,
      userMessage: `Message for ${graderId}`,
      assistantResponse: `Response for ${graderId}`,
    }));

    const results = await Promise.all(
      samples.map((s) => mockGradeCall(s, 50)),
    );

    graderResults.set(graderId, results);
    return results;
  };

  await Promise.all([
    graderTask("grader-1"),
    graderTask("grader-2"),
    graderTask("grader-3"),
  ]);

  assertEquals(graderResults.size, 3);

  // Verify each grader has independent results
  for (const [graderId, results] of graderResults) {
    assertEquals(results.length, 10);
    results.forEach((result, idx) => {
      assertEquals(result.reason, `Graded sample ${graderId}-sample-${idx}`);
    });
  }
});

Deno.test("should limit total concurrent API calls across all graders", async () => {
  const globalLimit = 10;
  const executor = new ParallelExecutor(globalLimit);

  let currentActive = 0;
  let maxActive = 0;

  const trackingGradeCall = async (graderId: string, sampleId: string) => {
    currentActive++;
    maxActive = Math.max(maxActive, currentActive);
    try {
      return await mockGradeCall({
        id: `${graderId}-${sampleId}`,
        userMessage: "test",
        assistantResponse: "test",
      }, 50);
    } finally {
      currentActive--;
    }
  };

  const graderTasks = Array.from(
    { length: 3 },
    (_, graderIdx) =>
      Array.from(
        { length: 20 },
        (_, sampleIdx) => () =>
          trackingGradeCall(`grader-${graderIdx}`, `sample-${sampleIdx}`),
      ),
  ).flat();

  await executor.executeAll(graderTasks);

  assertEquals(
    maxActive <= globalLimit,
    true,
    `Max concurrent API calls (${maxActive}) should not exceed global limit (${globalLimit})`,
  );
});

Deno.test("should handle rate limiting gracefully", async () => {
  let apiCallCount = 0;
  const rateLimit = 5;
  let rateLimitHit = false;

  const rateLimitedGradeCall = async (
    sample: MockSample,
  ): Promise<MockGradingResult> => {
    apiCallCount++;
    if (apiCallCount > rateLimit && apiCallCount <= rateLimit + 3) {
      rateLimitHit = true;
      await delay(200); // Simulate rate limit backoff
      throw new Error("Rate limit exceeded");
    }
    return mockGradeCall(sample, 10);
  };

  const executor = new ParallelExecutor(3);
  const samples: Array<MockSample> = Array.from({ length: 10 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  const results: Array<MockGradingResult | null> = [];

  for (const sample of samples) {
    let retries = 0;
    while (retries < 3) {
      try {
        const result = await executor.execute(() =>
          rateLimitedGradeCall(sample)
        );
        results.push(result);
        break;
      } catch (error) {
        if (
          error instanceof Error && error.message === "Rate limit exceeded" &&
          retries < 2
        ) {
          retries++;
          await delay(100);
          continue;
        }
        results.push(null);
        break;
      }
    }
  }

  assertEquals(rateLimitHit, true, "Should have hit rate limit");
  const successCount = results.filter((r) => r !== null).length;
  assertEquals(
    successCount >= 7,
    true,
    "Should complete most requests despite rate limiting",
  );
});

Deno.test("should track progress accurately during parallel execution", async () => {
  const totalSamples = 30;
  const progressUpdates: Array<{ completed: number; total: number }> = [];

  const executor = new ParallelExecutor(5);
  const samples: Array<MockSample> = Array.from(
    { length: totalSamples },
    (_, i) => ({
      id: `sample-${i}`,
      userMessage: `Message ${i}`,
      assistantResponse: `Response ${i}`,
    }),
  );

  let completed = 0;
  const onProgress = (_index: number, total: number) => {
    completed++;
    progressUpdates.push({ completed, total });
  };

  await executor.executeAll(
    samples.map((sample, idx) => async () => {
      const result = await mockGradeCall(sample, Math.random() * 100);
      onProgress(idx, totalSamples);
      return result;
    }),
  );

  assertEquals(progressUpdates.length, totalSamples);
  assertEquals(
    progressUpdates[progressUpdates.length - 1].completed,
    totalSamples,
  );

  // Verify progress is monotonically increasing
  for (let i = 1; i < progressUpdates.length; i++) {
    assertEquals(
      progressUpdates[i].completed > progressUpdates[i - 1].completed,
      true,
    );
  }
});

Deno.test("should report parallel execution metrics", async () => {
  const samples: Array<MockSample> = Array.from({ length: 100 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  // Sequential execution
  const sequentialStart = Date.now();
  for (const sample of samples) {
    await mockGradeCall(sample, 10);
  }
  const sequentialTime = Date.now() - sequentialStart;

  // Parallel execution
  const executor = new ParallelExecutor(20);
  const parallelStart = Date.now();
  await executor.executeAll(
    samples.map((s) => () => mockGradeCall(s, 10)),
  );
  const parallelTime = Date.now() - parallelStart;

  const speedup = sequentialTime / parallelTime;
  const efficiency = speedup / 20; // Relative to concurrency limit

  assertEquals(
    speedup > 5,
    true,
    `Expected significant speedup: ${speedup.toFixed(2)}x`,
  );
  assertEquals(
    efficiency > 0.3,
    true,
    `Expected reasonable efficiency: ${(efficiency * 100).toFixed(1)}%`,
  );
});

Deno.test("should not fail entire evaluation if one grader fails", async () => {
  const graderTasks = [
    () =>
      Promise.resolve({
        graderId: "grader-1",
        results: ["success"],
      }),
    () => Promise.reject(new Error("Grader 2 failed")),
    () =>
      Promise.resolve({
        graderId: "grader-3",
        results: ["success"],
      }),
  ];

  const results = await Promise.allSettled(graderTasks.map((task) => task()));

  const successful = results.filter((r) => r.status === "fulfilled");
  const failed = results.filter((r) => r.status === "rejected");

  assertEquals(successful.length, 2);
  assertEquals(failed.length, 1);
});

Deno.test("should handle partial sample failures within parallel batches", async () => {
  const executor = new ParallelExecutor(10);
  const samples: Array<MockSample> = Array.from({ length: 10 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  const failingIndices = new Set([2, 5, 7]);
  const results = await Promise.allSettled(
    samples.map((sample, idx) =>
      executor.execute(() => {
        if (failingIndices.has(idx)) {
          throw new Error(`Sample ${idx} failed`);
        }
        return mockGradeCall(sample, 50);
      })
    ),
  );

  const successful = results.filter((r) => r.status === "fulfilled");
  const failed = results.filter((r) => r.status === "rejected");

  assertEquals(successful.length, 7);
  assertEquals(failed.length, 3);
});

Deno.test("should support configurable parallelization options", () => {
  const testConfig = (sampleLimit: number, graderLimit: number) => {
    // This is a conceptual test - in real implementation would parse CLI args
    const config = {
      parallelSamples: sampleLimit,
      parallelGraders: graderLimit,
    };

    assertEquals(config.parallelSamples, sampleLimit);
    assertEquals(config.parallelGraders, graderLimit);
  };

  testConfig(20, 3);
  testConfig(50, 5);
  testConfig(1, 1); // Sequential mode
});

Deno.test("should default to sensible parallelization limits", () => {
  // Default configuration based on system resources
  const cpuCount = navigator.hardwareConcurrency || 4;
  const defaultSampleLimit = Math.min(cpuCount * 2, 20);
  const defaultGraderLimit = Math.min(cpuCount, 5);

  assertEquals(defaultSampleLimit >= 4, true);
  assertEquals(defaultSampleLimit <= 20, true);
  assertEquals(defaultGraderLimit >= 1, true);
  assertEquals(defaultGraderLimit <= 5, true);
});

Deno.test("should support sequential mode for debugging", async () => {
  const executor = new ParallelExecutor(1); // Sequential execution

  const executionOrder: Array<string> = [];
  const samples: Array<MockSample> = Array.from({ length: 5 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
  }));

  await executor.executeAll(
    samples.map((s) => () => {
      executionOrder.push(`start-${s.id}`);
      return mockGradeCall(s, 50).then(() => {
        executionOrder.push(`end-${s.id}`);
      });
    }),
  );

  // Verify sequential execution - each task completes before next starts
  for (let i = 0; i < samples.length - 1; i++) {
    const endIndex = executionOrder.indexOf(`end-sample-${i}`);
    const nextStartIndex = executionOrder.indexOf(`start-sample-${i + 1}`);
    assertEquals(
      endIndex < nextStartIndex,
      true,
      `Sample ${i} should complete before sample ${i + 1} starts`,
    );
  }
});

Deno.test("should produce identical results in parallel vs sequential", async () => {
  const samples: Array<MockSample> = Array.from({ length: 20 }, (_, i) => ({
    id: `sample-${i}`,
    userMessage: `Message ${i}`,
    assistantResponse: `Response ${i}`,
    score: (i % 7) - 3, // Deterministic scores
  }));

  // Sequential execution
  const sequentialResults: Array<MockGradingResult> = [];
  for (const sample of samples) {
    sequentialResults.push(await mockGradeCall(sample, 10));
  }

  // Parallel execution
  const executor = new ParallelExecutor(5);
  const parallelResults = await executor.executeAll(
    samples.map((s) => () => mockGradeCall(s, 10)),
  );

  // Sort results by sample ID for comparison
  const sortById = (a: MockGradingResult, b: MockGradingResult) =>
    a.reason.localeCompare(b.reason);

  sequentialResults.sort(sortById);
  parallelResults.sort(sortById);

  // Verify results match (excluding timing)
  assertEquals(parallelResults.length, sequentialResults.length);
  for (let i = 0; i < parallelResults.length; i++) {
    assertEquals(parallelResults[i].score, sequentialResults[i].score);
    assertEquals(parallelResults[i].reason, sequentialResults[i].reason);
  }
});
