#! /usr/bin/env -S bft test

import {
  assertEquals,
  assertExists,
  assertRejects,
  type assertThrows as _assertThrows,
} from "@std/assert";
import { BfSampleFeedback } from "../BfSampleFeedback.ts";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import type { InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

type BfSampleFeedbackProps = InferProps<typeof BfSampleFeedback>;

Deno.test("BfSampleFeedback - basic node creation with required fields", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    const props: BfSampleFeedbackProps = {
      score: 2,
      explanation: "This response was helpful and accurate.",
      bfSampleId: "sample-456",
    };

    const feedback = await BfSampleFeedback.__DANGEROUS__createUnattached(
      cv,
      props,
    );

    assertEquals(feedback.props.score, 2);
    assertEquals(
      feedback.props.explanation,
      "This response was helpful and accurate.",
    );
    assertEquals(feedback.props.bfSampleId, "sample-456");
    assertExists(feedback.metadata.bfGid);
    assertExists(feedback.metadata.createdAt);
  });
});

Deno.test("BfSampleFeedback - organization scoping via CurrentViewer", async () => {
  await withIsolatedDb(async () => {
    const cv1 = makeLoggedInCv({ orgSlug: "org1" });
    const cv2 = makeLoggedInCv({ orgSlug: "org2" });

    const props: BfSampleFeedbackProps = {
      score: 1,
      explanation: "Needs improvement",
      bfSampleId: "sample-012",
    };

    const feedback1 = await BfSampleFeedback.__DANGEROUS__createUnattached(
      cv1,
      props,
    );
    const feedback2 = await BfSampleFeedback.__DANGEROUS__createUnattached(
      cv2,
      props,
    );

    // Should have different organization IDs
    assertEquals(feedback1.metadata.bfOid !== feedback2.metadata.bfOid, true);
    assertEquals(feedback1.metadata.bfOid, cv1.orgBfOid);
    assertEquals(feedback2.metadata.bfOid, cv2.orgBfOid);
  });
});

Deno.test("BfSampleFeedback - GraphQL schema generation validation", () => {
  const spec = BfSampleFeedback.gqlSpec;

  // Should have spec fields defined
  assertExists(spec);
  assertExists(spec.fields);

  // Check that key fields are present in the spec
  const fieldNames = Object.keys(spec.fields);
  assertEquals(fieldNames.includes("score"), true);
  assertEquals(fieldNames.includes("explanation"), true);
  assertEquals(fieldNames.includes("bfSampleId"), true);
  // Note: id and createdAt are inherited from BfNode base class
});

Deno.test("BfSampleFeedback - BfNode spec validation", () => {
  const { fields } = BfSampleFeedback.bfNodeSpec;

  // Should have all required BfNode fields
  assertExists(fields.score);
  assertExists(fields.explanation);
  assertExists(fields.bfSampleId);

  assertEquals(fields.score.kind, "number");
  assertEquals(fields.explanation.kind, "string");
  assertEquals(fields.bfSampleId.kind, "string");
});

Deno.test("BfSampleFeedback - score validation in range -3 to +3", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Valid scores should work
    for (const score of [-3, -2, -1, 0, 1, 2, 3]) {
      const props: BfSampleFeedbackProps = {
        score: score,
        explanation: "Test explanation",
        bfSampleId: "sample-test",
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
        bfSampleId: "sample-test",
      };

      await assertRejects(
        () => BfSampleFeedback.__DANGEROUS__createUnattached(cv, props),
        Error,
        "score must be between -3 and 3",
      );
    }
  });
});

Deno.test("BfSampleFeedback - relationships to BfSample", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    const props: BfSampleFeedbackProps = {
      score: 2,
      explanation: "Good response",
      bfSampleId: "sample-rel-test",
    };

    const feedback = await BfSampleFeedback.__DANGEROUS__createUnattached(
      cv,
      props,
    );

    // Should have the relationship ID stored
    assertEquals(feedback.props.bfSampleId, "sample-rel-test");

    // GraphQL spec should be defined
    const spec = BfSampleFeedback.gqlSpec;
    assertExists(spec);
    assertExists(spec.fields);
  });
});

Deno.test("BfSampleFeedback - DateTime field for createdAt", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    const beforeCreation = new Date();

    const props: BfSampleFeedbackProps = {
      score: 0,
      explanation: "Neutral feedback",
      bfSampleId: "sample-time-test",
    };

    const feedback = await BfSampleFeedback.__DANGEROUS__createUnattached(
      cv,
      props,
    );

    const afterCreation = new Date();

    assertExists(feedback.metadata.createdAt);
    assertEquals(feedback.metadata.createdAt instanceof Date, true);
    assertEquals(
      feedback.metadata.createdAt.getTime() >= beforeCreation.getTime(),
      true,
    );
    assertEquals(
      feedback.metadata.createdAt.getTime() <= afterCreation.getTime(),
      true,
    );
  });
});

Deno.test("BfSampleFeedback - database persistence and retrieval", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    const props: BfSampleFeedbackProps = {
      score: -1,
      explanation: "Could be improved significantly",
      bfSampleId: "sample-persist-test",
    };

    // Create and save
    const feedback = await BfSampleFeedback.__DANGEROUS__createUnattached(
      cv,
      props,
    );
    await feedback.save();

    // Retrieve and verify
    const retrieved = await BfSampleFeedback.findX(
      cv,
      feedback.metadata.bfGid,
    );

    assertEquals(retrieved.props.score, -1);
    assertEquals(
      retrieved.props.explanation,
      "Could be improved significantly",
    );
    assertEquals(retrieved.props.bfSampleId, "sample-persist-test");
    assertEquals(retrieved.metadata.bfGid, feedback.metadata.bfGid);
  });
});

Deno.test("BfSampleFeedback - score range validation", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Score too low
    await assertRejects(
      () =>
        BfSampleFeedback.__DANGEROUS__createUnattached(cv, {
          score: -4,
          explanation: "Test",
          bfSampleId: "sample-456",
        }),
      Error,
      "score must be between -3 and 3",
    );

    // Score too high
    await assertRejects(
      () =>
        BfSampleFeedback.__DANGEROUS__createUnattached(cv, {
          score: 4,
          explanation: "Test",
          bfSampleId: "sample-456",
        }),
      Error,
      "score must be between -3 and 3",
    );
  });
});
