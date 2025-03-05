export interface BfContentItemProps extends BfNodeBaseProps {
  title: string;
  body: string;
  slug: string;
  filePath?: string;
  summary?: string;
  author?: string;
  cta?: string;
  href?: string;
}

class BfContentItem extends BfNodeBase<BfContentItemProps> {
  // Implementation details
}

// In BfContentCollection.ts
async addItem(cv: BfCurrentViewer, item: BfContentItem): Promise<BfEdge> {
  return BfEdge.createBetweenNodes(cv, this, item);
}

async getItems(cv: BfCurrentViewer): Promise<BfContentItem[]> {
  const edges = await BfEdge.queryTargetInstances(
    cv,
    BfContentItem,
    this.metadata.bfGid
  );

  return edges;
}

// Update resolvers to use the new relationship
export const graphqlBfContentCollectionType = objectType({
  name: "BfContentCollection",
  definition(t) {
    t.implements(graphqlBfNode);
    t.string("title");
    t.string("description");
    t.list.field("items", {
      type: "BfContentItem",
      resolve: async (parent, _args, ctx) => {
        const collection = await ctx.findX(
          BfContentCollection,
          toBfGid(parent.id),
        );

        // Use the new relationship method
        const items = await collection.getItems(ctx.cv);
        return items.map((item) => item.toGraphql());
      },
    });
  },
});