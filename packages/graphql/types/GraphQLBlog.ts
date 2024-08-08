import { objectType, stringArg } from "nexus";
import { connectionFromArray } from "packages/graphql/deps.ts";

export const Blog = objectType({
  name: "Blog",
  definition(t) {
    t.string("title");
    t.connectionField("posts", {
      type: "BlogPost",
      additionalArgs: {
        slug: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        return connectionFromArray([{
          title: "lol",
          slug: "lol",
          content: "lol",
        }], args);
      },
    });
  },
});

export const BlogPost = objectType({
  name: "BlogPost",
  definition(t) {
    t.string("title");
    t.string("slug");
    t.string("content");
  },
});
