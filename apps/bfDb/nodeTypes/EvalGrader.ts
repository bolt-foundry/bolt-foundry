import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import {
  GraphQLDescription,
  GraphQLField,
  GraphQLInterface,
  GraphQLNonNull,
  GraphQLNullable,
} from "@bfmono/apps/bfDb/graphql/decorators.ts";
import { GraphQLString } from "graphql";

@GraphQLInterface("BfNode")
@GraphQLDescription("A grader that evaluates AI responses within a deck")
export class EvalGrader extends BfNode {
  static override nodeType = "EvalGrader";

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("The name of the grader")
  name!: string;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("The evaluation prompt for this grader")
  prompt!: string;

  @GraphQLField(GraphQLNullable(GraphQLString))
  @GraphQLDescription("Optional description of what this grader checks for")
  description?: string;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("The deck ID this grader belongs to")
  deckId!: string;

  @GraphQLField(GraphQLNullable(GraphQLString))
  @GraphQLDescription("JSON configuration for grader settings")
  settings?: string;
}
