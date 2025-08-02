import {
  BfNode,
  type InferProps as _InferProps,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { BfMetadata } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

type BfGraderResultProps = {
  score: number;
  explanation: string;
  reasoningProcess: string;
};

export class BfGraderResult extends BfNode<BfGraderResultProps> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .int("score")
      .string("explanation")
      .string("reasoningProcess")
  );

  static override bfNodeSpec: ReturnType<typeof BfGraderResult.defineBfNode> =
    this.defineBfNode((f) =>
      f
        .number("score")
        .string("explanation")
        .string("reasoningProcess")
        .one("bfGrader", () => import("./BfGrader.ts").then((m) => m.BfGrader))
        .one("bfSample", () => import("./BfSample.ts").then((m) => m.BfSample))
    );

  constructor(
    cv: CurrentViewer,
    props: BfGraderResultProps,
    metadata?: Partial<BfMetadata>,
  ) {
    // Validate score range (business logic)
    if (
      typeof props.score === "number" && (props.score < -3 || props.score > 3)
    ) {
      throw new Error("Score must be between -3 and 3");
    }

    const processedProps = {
      ...props,
    };

    super(cv, processedProps, metadata);
  }
}
