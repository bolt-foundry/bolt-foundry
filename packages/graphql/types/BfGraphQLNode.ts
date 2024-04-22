import { interfaceType } from "packages/graphql/deps.ts";

export const BfNode = interfaceType({
  name: "BfNode",
  definition(t) {
    t.nonNull.id("id", { description: "Unique identifier for the resource" });
  },
});
