# Worker Queue Implementation Memo

**Date**: 2025-07-29\
**Author**: Engineering Team\
**Status**: Draft

## Executive Summary

This memo outlines the implementation plan for a worker queue system in Bolt
Foundry to handle asynchronous usage tracking, billing updates, and other
background processing tasks. The system will leverage our existing bfDb
architecture and integrate seamlessly with current usage tracking
infrastructure.

## Problem Statement

Currently, usage tracking and billing operations happen synchronously during API
calls, which:

- Increases API response latency
- Risks data loss if tracking fails
- Lacks retry mechanisms for transient failures
- Cannot handle batch processing efficiently
- Makes it difficult to scale processing independently

## Proposed Solution

Implement a database-backed job queue system using bfDb's node architecture,
with dedicated worker processes for asynchronous job execution.

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

#### 1.1 Create BfJob Entity

**Location**: `/workspace/apps/bfDb/nodeTypes/BfJob.ts`

```typescript
import { BfNode } from "../classes/BfNode.ts";
import { z } from "zod";

const JobStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);
const JobPrioritySchema = z.number().min(0).max(100);

export class BfJob extends BfNode {
  static readonly className = "BfJob";

  static readonly propsSchema = z.object({
    // Job identification
    type: z.string(),
    queue: z.string().default("default"),

    // Status tracking
    status: JobStatusSchema,
    priority: JobPrioritySchema.default(50),

    // Payload and results
    payload: z.record(z.unknown()),
    result: z.record(z.unknown()).optional(),
    error: z.string().optional(),

    // Timing
    scheduledAt: z.date(),
    startedAt: z.date().optional(),
    completedAt: z.date().optional(),

    // Retry configuration
    attempts: z.number().default(0),
    maxAttempts: z.number().default(3),
    nextRetryAt: z.date().optional(),

    // Worker tracking
    workerId: z.string().optional(),
  });

  static gqlSpec = this.defineGqlNode((gql) =>
    gql
      .enum("status", JobStatusSchema)
      .int("priority")
      .string("type")
      .string("queue")
      .json("payload")
      .json("result")
      .string("error")
      .date("scheduledAt")
      .date("startedAt")
      .date("completedAt")
      .int("attempts")
      .int("maxAttempts")
      .string("workerId")
      .mutation("enqueue", {
        args: (a) => ({
          type: a.string("type"),
          queue: a.string("queue").optional(),
          payload: a.json("payload"),
          priority: a.int("priority").optional(),
          scheduledAt: a.date("scheduledAt").optional(),
        }),
        returns: (r) => r.node("job", BfJob),
        async resolve(_src, args, { bfCurrentViewer }) {
          return await BfJob.create({
            ...args,
            status: "pending",
            scheduledAt: args.scheduledAt || new Date(),
          }, bfCurrentViewer);
        },
      })
  );
}
```

#### 1.2 Queue Manager Service

**Location**: `/workspace/packages/worker-queue/QueueManager.ts`

```typescript
export class QueueManager {
  constructor(
    private storage: BfStorageAdapter,
    private config: QueueConfig,
  ) {}

  async enqueueJob(params: {
    type: string;
    payload: Record<string, unknown>;
    queue?: string;
    priority?: number;
    scheduledAt?: Date;
  }): Promise<BfJob> {
    // Implementation
  }

  async claimNextJob(queue: string, workerId: string): Promise<BfJob | null> {
    // Atomic claim operation
    // 1. Find next pending job
    // 2. Update status to processing
    // 3. Set workerId and startedAt
  }

  async completeJob(
    jobId: string,
    result: Record<string, unknown>,
  ): Promise<void> {
    // Mark job as completed
  }

  async failJob(jobId: string, error: string): Promise<void> {
    // Handle failure and schedule retry
  }
}
```

### Phase 2: Worker Implementation (Week 2)

#### 2.1 Base Worker Class

**Location**: `/workspace/packages/worker-queue/Worker.ts`

```typescript
export abstract class Worker {
  protected abstract readonly queueName: string;
  protected abstract readonly concurrency: number;

  abstract processJob(job: BfJob): Promise<JobResult>;

  async start(): Promise<void> {
    const promises = Array(this.concurrency)
      .fill(null)
      .map(() => this.runWorkerLoop());

    await Promise.all(promises);
  }

  private async runWorkerLoop(): Promise<void> {
    while (!this.stopped) {
      try {
        const job = await this.queueManager.claimNextJob(
          this.queueName,
          this.workerId,
        );

        if (!job) {
          await sleep(1000);
          continue;
        }

        await this.executeJob(job);
      } catch (error) {
        console.error("Worker loop error:", error);
        await sleep(5000);
      }
    }
  }
}
```

#### 2.2 Usage Tracking Worker

**Location**: `/workspace/apps/collector/workers/UsageTrackingWorker.ts`

```typescript
export class UsageTrackingWorker extends Worker {
  protected readonly queueName = "usage-tracking";
  protected readonly concurrency = 5;

  async processJob(job: BfJob): Promise<JobResult> {
    const { type, payload } = job.props;

    switch (type) {
      case "track_llm_usage":
        return await this.trackLlmUsage(payload);
      case "calculate_costs":
        return await this.calculateCosts(payload);
      case "send_to_posthog":
        return await this.sendToPostHog(payload);
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  }
}
```

### Phase 3: Integration (Week 3)

#### 3.1 Update LLM Event Tracker

Modify `/workspace/apps/collector/llm-event-tracker.ts` to enqueue jobs:

```typescript
// Before
await sendToPostHog(event);

// After
await queueManager.enqueueJob({
  type: "track_llm_usage",
  queue: "usage-tracking",
  payload: { event },
  priority: 80,
});
```

#### 3.2 Add Worker Command

Create BFT task: `/workspace/infra/bft/tasks/worker.bft.ts`

```typescript
export async function worker(args: string[]): Promise<number> {
  const workerType = args[0] || "all";

  const workers = {
    usage: new UsageTrackingWorker(),
    billing: new BillingWorker(),
  };

  if (workerType === "all") {
    await Promise.all(Object.values(workers).map((w) => w.start()));
  } else {
    await workers[workerType]?.start();
  }

  return 0;
}
```

### Phase 4: Monitoring & Operations (Week 4)

#### 4.1 Queue Dashboard

Create monitoring endpoints in bfDb GraphQL:

```typescript
type QueueStats {
  queueName: String!
  pending: Int!
  processing: Int!
  completed24h: Int!
  failed24h: Int!
  avgProcessingTime: Float!
}

type Query {
  queueStats: [QueueStats!]!
  recentFailedJobs(limit: Int): [BfJob!]!
}
```

#### 4.2 Dead Letter Queue

Implement DLQ for jobs that exceed max attempts:

```typescript
class DeadLetterQueue {
  async moveToDeadLetter(job: BfJob): Promise<void> {
    await BfJob.update(job.bfGid, {
      status: "failed",
      queue: `dlq:${job.props.queue}`,
    });
  }
}
```

## Migration Strategy

1. **Dual-write period**: Keep synchronous tracking while also enqueuing jobs
2. **Validation**: Compare async results with sync baseline
3. **Gradual rollout**: Start with non-critical events
4. **Full migration**: Remove synchronous calls once stable

## Performance Considerations

- Use database indexes on: `status`, `queue`, `scheduledAt`, `priority`
- Implement connection pooling for workers
- Add circuit breakers for external services
- Consider partitioning job table by status/date

## Security Considerations

- Validate job payloads against schemas
- Implement job-level permissions
- Audit log for sensitive operations
- Encrypt sensitive payload data

## Success Metrics

- **Latency**: 50% reduction in API response times
- **Reliability**: 99.9% job completion rate
- **Throughput**: Handle 10K jobs/minute
- **Visibility**: Real-time queue monitoring

## Timeline

- Week 1: Core infrastructure
- Week 2: Worker implementation
- Week 3: Integration with existing systems
- Week 4: Monitoring and operations
- Week 5: Testing and documentation
- Week 6: Production rollout

## Open Questions

1. Should we use Deno KV for job state instead of bfDb?
2. Do we need distributed locking for multi-instance deployments?
3. Should job history be archived after X days?
4. What alerting thresholds for queue depth/processing time?

## Next Steps

1. Review and approve design
2. Create implementation tickets
3. Set up development environment
4. Begin Phase 1 implementation

## References

- [bfDb Architecture Guide](/workspace/memos/guides/bfdb-architecture.md)
- [Billing Implementation Guide](/workspace/memos/guides/billing-implementation-guide.md)
- [Parallel Executor Pattern](/workspace/apps/aibff/lib/parallel-executor.ts)
