import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { PublishedDocument } from "apps/bfDb/nodeTypes/PublishedDocument.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      .object("documentsBySlug", () => PublishedDocument, {
        args: (a) => a.nonNull.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = args.slug as string;
          const post = await PublishedDocument.findX(slug).catch(() => null);
          return post;
        },
      })
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
