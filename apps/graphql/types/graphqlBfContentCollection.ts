import { BfContentCollection } from "apps/bfDb/models/BfContentCollection.ts";
import { idArg, nonNull, objectType } from "nexus";
import { graphqlBfNode } from "apps/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger/logger.ts";
import { toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import { BfContentItem } from "apps/bfDb/models/BfContentItem.ts";

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
      resolve: async (_parent, { id }, ctx) => {
        // const collection = await ctx.findX(BfContentCollection, toBfGid(parent.id));
        // const item = await ctx.findTargetX(collection, BfContentItem, toBfGid(id)));

        // #techdebt b/c we haven't yet implemented queryTargets on the context, so any item on any collection will return. 🤷
        const item = await ctx.findX(BfContentItem, toBfGid(id));
        return item.toGraphql();
      },
    });
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
