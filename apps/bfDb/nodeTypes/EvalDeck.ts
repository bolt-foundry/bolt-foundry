import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import {
  GraphQLArg,
  GraphQLDescription,
  GraphQLField,
  GraphQLInterface,
  GraphQLMutation,
  GraphQLNonNull,
  GraphQLNullable,
} from "@bfmono/apps/bfDb/graphql/decorators.ts";
import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

@GraphQLInterface("BfNode")
@GraphQLDescription("An evaluation deck for grading AI responses")
export class EvalDeck extends BfNode {
  static override nodeType = "EvalDeck";

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("The name of the evaluation deck")
  name!: string;

  @GraphQLField(GraphQLNullable(GraphQLString))
  @GraphQLDescription("Description of what this deck evaluates")
  description?: string;

  @GraphQLField(GraphQLNullable(GraphQLString))
  @GraphQLDescription("System prompt for the evaluation context")
  systemPrompt?: string;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("Status of the deck (active, inactive, draft)")
  status!: "active" | "inactive" | "draft";

  @GraphQLField(GraphQLNonNull(GraphQLInt))
  @GraphQLDescription("Number of graders in this deck")
  get graderCount(): number {
    // TODO: Implement actual count from edges
    return 0;
  }

  @GraphQLField(GraphQLNonNull(GraphQLInt))
  @GraphQLDescription("Agreement rate percentage")
  get agreementRate(): number {
    // TODO: Calculate from grading results
    return 0;
  }

  @GraphQLField(GraphQLNonNull(GraphQLInt))
  @GraphQLDescription("Total number of tests run")
  get totalTests(): number {
    // TODO: Calculate from grading results
    return 0;
  }

  @GraphQLMutation({
    args: {
      name: GraphQLArg(GraphQLNonNull(GraphQLString)),
      description: GraphQLArg(GraphQLNullable(GraphQLString)),
      systemPrompt: GraphQLArg(GraphQLNullable(GraphQLString)),
    },
  })
  @GraphQLDescription("Create a new evaluation deck")
  static async createDeck(args: {
    name: string;
    description?: string;
    systemPrompt?: string;
  }): Promise<EvalDeck> {
    logger.info("Creating new deck", args);

    const deck = new EvalDeck();
    deck.name = args.name;
    deck.description = args.description;
    deck.systemPrompt = args.systemPrompt;
    deck.status = "draft";

    await deck.save();
    return deck;
  }

  @GraphQLMutation({
    args: {
      id: GraphQLArg(GraphQLNonNull(GraphQLID)),
      name: GraphQLArg(GraphQLNullable(GraphQLString)),
      description: GraphQLArg(GraphQLNullable(GraphQLString)),
      systemPrompt: GraphQLArg(GraphQLNullable(GraphQLString)),
      status: GraphQLArg(GraphQLNullable(GraphQLString)),
    },
  })
  @GraphQLDescription("Update an existing evaluation deck")
  static async updateDeck(args: {
    id: string;
    name?: string;
    description?: string;
    systemPrompt?: string;
    status?: string;
  }): Promise<EvalDeck> {
    logger.info("Updating deck", args);

    const deck = await EvalDeck.load(args.id) as EvalDeck;

    if (args.name !== undefined) deck.name = args.name;
    if (args.description !== undefined) deck.description = args.description;
    if (args.systemPrompt !== undefined) deck.systemPrompt = args.systemPrompt;
    if (args.status !== undefined) {
      deck.status = args.status as "active" | "inactive" | "draft";
    }

    await deck.save();
    return deck;
  }
}
