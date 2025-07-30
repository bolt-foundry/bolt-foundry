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
      .typedMutation("submitFeedback", {
        args: (a) =>
          a
            .nonNull.string("sampleId")
            .nonNull.int("score")
            .nonNull.string("explanation"),
        returns: "BfSampleFeedback",
        resolve: async (_src, args, ctx) => {
          const cv = ctx.getCurrentViewer();
          const { BfSample } = await import("./BfSample.ts");
          const sample = await BfSample.findX(
            cv,
            args.sampleId as import("@bfmono/lib/types.ts").BfGid,
          );
          const feedback = await sample.createTargetNode(BfSampleFeedback, {
            score: args.score,
            explanation: args.explanation,
          });
          return feedback.toGraphql();
        },
      })
  );

  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .number("score")
      .string("explanation")
      .one("bfSample", () => import("./BfSample.ts").then((m) => m.BfSample))
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
