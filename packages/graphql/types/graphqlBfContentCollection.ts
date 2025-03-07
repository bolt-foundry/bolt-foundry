import { BfContentCollection } from "packages/bfDb/models/BfContentCollection.ts";
import { idArg, nonNull, objectType } from "nexus";
import { graphqlBfNode } from "packages/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger.ts";
import { toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { BfContentItem } from "packages/bfDb/models/BfContentItem.ts";

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
    // Connection field for content items (direct children only in Phase 1)
    t.connectionField("items", {
      type: graphqlBfContentItemType,
      resolve: async (parent, args, ctx) => {
        const collection = await ctx.findX(
          BfContentCollection,
          toBfGid(parent.id),
        );

        return collection.queryTargetsConnectionForGraphql(BfContentItem, args);
      },
    });

    // Connection field for child collections (direct children only in Phase 1)
    t.connectionField("childCollections", {
      type: "BfContentCollection",
      resolve: async (parent, args, ctx) => {
        const collection = await ctx.findX(
          BfContentCollection,
          toBfGid(parent.id),
        );
        return collection.queryTargetsConnectionForGraphql(
          BfContentCollection,
          args,
        );
      },
    });
  },
});
