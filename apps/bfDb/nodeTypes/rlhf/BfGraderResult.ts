import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { BfMetadata } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

export class BfGraderResult extends BfNode<InferProps<typeof BfGraderResult>> {
  static override gqlSpec = this.defineGqlNode((gql) => gql.nonNull.id("id"));

  static override bfNodeSpec = this.defineBfNode((f) =>
    f
      .number("score")
      .string("explanation")
      .string("reasoningProcess")
      .one("bfGrader", () => import("./BfGrader.ts").then((m) => m.BfGrader))
      .one("bfSample", () => import("./BfSample.ts").then((m) => m.BfSample))
  );

  constructor(
    cv: CurrentViewer,
    props: InferProps<typeof BfGraderResult>,
    metadata?: Partial<BfMetadata>,
  ) {
    // Validate score range (business logic)
    if (props.score < -3 || props.score > 3) {
      throw new Error("Score must be between -3 and 3");
    }

    const processedProps = {
      ...props,
    };

    super(cv, processedProps, metadata);
  }
}
