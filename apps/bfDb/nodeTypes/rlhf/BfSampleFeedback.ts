import {
  type BfMetadata,
  BfNode,
  type InferProps,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

export class BfSampleFeedback
  extends BfNode<InferProps<typeof BfSampleFeedback>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .int("score")
      .string("explanation")
      .id("bfSampleId")
      .object(
        "bfGrader",
        () => import("../BfGrader.ts").then((m) => m.BfGrader),
      )
      .object(
        "bfSample",
        () => import("../BfSample.ts").then((m) => m.BfSample),
      )
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .number("score")
      .string("explanation")
      .string("bfSampleId")
  );

  constructor(
    cv: CurrentViewer,
    props: InferProps<typeof BfSampleFeedback>,
    metadata?: Partial<BfMetadata>,
  ) {
    // Validate score is in the valid range
    if (props.score < -3 || props.score > 3) {
      throw new Error("score must be between -3 and 3");
    }

    super(cv, props, metadata);
  }
}
