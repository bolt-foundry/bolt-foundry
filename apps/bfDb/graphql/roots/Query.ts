import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { BlogPost } from "apps/bfDb/nodeTypes/BlogPost.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      .string("documentsBySlug", {
        args: (a) => a.nonNull.string("slug"),
        resolve: async (_root, args, _ctx, _info) => {
          const slug = args.slug as string;
          const post = await BlogPost.find(slug) as BlogPost | null;
          return (post?.content || null) as string;
        },
      })
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
