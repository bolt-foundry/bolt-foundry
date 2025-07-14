#! /usr/bin/env -S bft test

import { assertEquals, assertRejects } from "@std/assert";
import { BfSampleFeedback } from "../BfSampleFeedback.ts";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import type { InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

type BfSampleFeedbackProps = InferProps<typeof BfSampleFeedback>;

Deno.test("BfSampleFeedback - score validation in range -3 to +3", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Valid scores should work
    for (const score of [-3, -2, -1, 0, 1, 2, 3]) {
      const props: BfSampleFeedbackProps = {
        score: score,
        explanation: "Test explanation",
      };

      const feedback = await BfSampleFeedback
        .__DANGEROUS__createUnattached(cv, props);
      assertEquals(feedback.props.score, score);
    }

    // Invalid scores should throw validation errors
    for (const invalidScore of [-4, 4, 10, -10]) {
      const props: BfSampleFeedbackProps = {
        score: invalidScore,
        explanation: "Test explanation",
      };

      await assertRejects(
        () => BfSampleFeedback.__DANGEROUS__createUnattached(cv, props),
        Error,
        "score must be between -3 and 3",
      );
    }
  });
});
