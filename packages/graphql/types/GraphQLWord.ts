import { objectType } from "packages/graphql/deps.ts";

export const GraphQLWordType = objectType({
  name: "Word",
  definition: (t) => {
    t.string("text");
    t.msTime("startTime");
    t.msTime("endTime");
    t.string("speaker");
  },
});
