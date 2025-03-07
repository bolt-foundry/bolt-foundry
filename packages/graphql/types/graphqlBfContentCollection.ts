import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import { idArg, nonNull, objectType } from "nexus";
import { graphqlBfNode } from "packages/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger.ts";
import { toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { connectionFromArray } from "graphql-relay";

const _logger = getLogger(import.meta);

export const graphqlBfContentItemType = objectType({
  name: "BfContentItem",
  definition(t) {
    t.implements(graphqlBfNode);
    t.string("title");
    t.string("body");
    t.string("slug");
    t.string("author");
    t.string("summary");
    t.string("cta");
    t.string("href");
  },
});

export const graphqlBfContentCollectionType = objectType({
  name: "BfContentCollection",
  definition(t) {
    t.implements(graphqlBfNode);
    t.string("title");
    t.string("description");
    t.field("item", {
      type: graphqlBfContentItemType,
      args: {
        id: nonNull(idArg()),
      },
    });
    t.connectionField("items", {
      type: graphqlBfContentItemType,
      resolve: async (parent, args, ctx) => {
        const _collection = await ctx.findX(
          BfContentCollection,
          toBfGid(parent.id),
        );
        const examplePost = {
          id: "example",
          title: "Example Post",
          body: "This is an example post",
          slug: "example-post",
          author: "Example Author",
          summary: "This is an example summary",
          cta: "This is an example cta",
          href: "/blog/example-post",
        };

        return connectionFromArray([examplePost], args);
      },
    });
  },
});
