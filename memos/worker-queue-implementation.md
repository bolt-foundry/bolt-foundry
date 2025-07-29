# Worker Queue Implementation

**Date**: 2025-07-29\
**Status**: Ready to build

## Problem

We need a way to run tasks asynchronously in the background.

## Solution

Build a simple job queue backed by our existing database. Use Postgres row
locking for atomic job claiming.

## Implementation

### Step 1: Add BfJob node type

```typescript
// apps/bfDb/nodeTypes/BfJob.ts
import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

export class BfJob extends BfNode<InferProps<typeof BfJob>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("type")
      .json("payload")
      .enum("status", [
        "available",
        "claimed",
        "running",
        "completed",
        "failed",
      ])
      .number("attempts").default(0)
      .string("error").optional()
      .string("workerId").optional()
  );

  static async claimNext(workerId: string) {
    // Use Postgres row locking to atomically claim a job
    const result = await this.storage.query(`
      UPDATE bfDb 
      SET props = jsonb_set(
        jsonb_set(props, '{status}', '"claimed"'), 
        '{workerId}', '"${workerId}"'
      )
      WHERE bf_gid = (
        SELECT bf_gid FROM bfDb 
        WHERE class_name = 'BfJob' 
        AND props->>'status' = 'available'
        ORDER BY created_at
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    `);

    return result[0] ? new BfJob(result[0]) : null;
  }
}
```

### Step 2: Queue jobs instead of sync calls

```typescript
// Before:
await sendToPostHog(event);

// After:
await BfJob.create({
  type: "track_usage",
  payload: { event },
  status: "available",
}, viewer);
```

### Step 3: Simple worker loop

```typescript
// apps/collector/worker.ts
import { BfJob } from "@bfmono/apps/bfDb/nodeTypes/BfJob.ts";
import { sleep } from "@std/async/sleep";

const workerId = crypto.randomUUID();

while (true) {
  const job = await BfJob.claimNext(workerId);

  if (!job) {
    await sleep(1000);
    continue;
  }

  try {
    job.props.status = "running";
    await job.save();

    // Process based on job type
    switch (job.props.type) {
      case "track_usage":
        await sendToPostHog(job.props.payload.event);
        break;
      default:
        throw new Error(`Unknown job type: ${job.props.type}`);
    }

    job.props.status = "completed";
    await job.save();
  } catch (error) {
    job.props.attempts++;
    job.props.status = job.props.attempts >= 3 ? "failed" : "available";
    job.props.error = error.message;
    job.props.workerId = null; // Release for retry
    await job.save();
  }
}
```

### Step 4: Add worker command

```typescript
// infra/bft/tasks/worker.bft.ts
export async function worker(): Promise<number> {
  await import("../../apps/collector/worker.ts");
  return 0;
}
```

## Deployment

1. Deploy code with jobs being created
2. Run worker: `bft worker`
3. Check it works:
   `SELECT props->>'status', COUNT(*) FROM bfDb WHERE class_name = 'BfJob' GROUP BY 1`
4. Remove sync calls

## That's it

Simple queue that works. Add features when you need them.
