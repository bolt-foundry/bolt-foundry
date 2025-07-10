import { makeSchema, objectType, queryType } from "nexus";

const Query = queryType({
  definition(t) {
    t.field("hello", {
      type: "Hello",
      resolve: () => ({
        message: "Hello from GraphQL!",
        timestamp: new Date().toISOString(),
      }),
    });
  },
});

const Hello = objectType({
  name: "Hello",
  definition(t) {
    t.nonNull.string("message");
    t.nonNull.string("timestamp");
  },
});

export const schema = makeSchema({
  types: [Query, Hello],
  outputs: {
    schema: false,
    typegen: false,
  },
});
