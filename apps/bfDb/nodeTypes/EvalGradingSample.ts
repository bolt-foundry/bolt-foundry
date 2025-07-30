import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import {
  GraphQLArg,
  GraphQLDescription,
  GraphQLField,
  GraphQLInterface,
  GraphQLList,
  GraphQLMutation,
  GraphQLNonNull,
  GraphQLNullable,
  GraphQLQuery,
} from "@bfmono/apps/bfDb/graphql/decorators.ts";
import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { mockGradingSamples } from "@bfmono/apps/boltfoundry-com/mocks/gradingSamples.ts";

const logger = getLogger(import.meta);

@GraphQLInterface("BfNode")
@GraphQLDescription("A sample to be graded in an evaluation deck")
export class EvalGradingSample extends BfNode {
  static override nodeType = "EvalGradingSample";

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("ISO timestamp of when the sample was created")
  timestamp!: string;

  @GraphQLField(GraphQLNonNull(GraphQLInt))
  @GraphQLDescription("Duration of the API call in milliseconds")
  duration!: number;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("AI provider used (openai, anthropic, etc)")
  provider!: string;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("The request sent to the AI provider (JSON string)")
  request!: string;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("The response from the AI provider (JSON string)")
  response!: string;

  @GraphQLField(GraphQLNullable(GraphQLString))
  @GraphQLDescription("AI grader evaluations (JSON string)")
  graderEvaluations?: string;

  @GraphQLField(GraphQLNullable(GraphQLString))
  @GraphQLDescription("Human grading data (JSON string)")
  humanGrade?: string;

  @GraphQLField(GraphQLNonNull(GraphQLString))
  @GraphQLDescription("Metadata about the deck and context (JSON string)")
  bfMetadata!: string;

  @GraphQLQuery({
    args: {
      deckId: GraphQLArg(GraphQLNonNull(GraphQLID)),
    },
  })
  @GraphQLDescription("Get grading samples for a deck")
  static async getSamplesForDeck(args: {
    deckId: string;
  }): Promise<EvalGradingSample[]> {
    logger.info("Getting samples for deck", args);

    // For now, return mock data
    // In real implementation, this would query the database
    const samples = mockGradingSamples.map((mockSample, index) => {
      const sample = new EvalGradingSample();
      sample.id = mockSample.id;
      sample.timestamp = mockSample.timestamp;
      sample.duration = mockSample.duration;
      sample.provider = mockSample.provider;
      sample.request = JSON.stringify(mockSample.request);
      sample.response = JSON.stringify(mockSample.response);
      sample.graderEvaluations = JSON.stringify(mockSample.graderEvaluations);
      sample.bfMetadata = JSON.stringify(mockSample.bfMetadata);

      // Simulate some samples already having human grades
      if (index === 0) {
        sample.humanGrade = JSON.stringify({
          grades: [
            {
              graderId: "grader-1",
              score: 3,
              reason: "Accurate JSON conversion",
            },
            {
              graderId: "grader-2",
              score: 3,
              reason: "All data preserved correctly",
            },
          ],
          gradedBy: "user-123",
          gradedAt: new Date().toISOString(),
        });
      }

      return sample;
    });

    return samples;
  }

  @GraphQLMutation({
    args: {
      sampleId: GraphQLArg(GraphQLNonNull(GraphQLID)),
      grades: GraphQLArg(GraphQLNonNull(GraphQLString)),
      gradedBy: GraphQLArg(GraphQLNonNull(GraphQLString)),
    },
  })
  @GraphQLDescription("Save human grades for a sample")
  static async saveHumanGrade(args: {
    sampleId: string;
    grades: Array<{
      graderId: string;
      score: -3 | 3;
      reason: string;
    }>;
    gradedBy: string;
  }): Promise<EvalGradingSample> {
    logger.info("Saving human grade", args);

    // In real implementation, this would update the database
    const sample = await EvalGradingSample.load(
      args.sampleId,
    ) as EvalGradingSample;

    sample.humanGrade = {
      grades: args.grades,
      gradedBy: args.gradedBy,
      gradedAt: new Date().toISOString(),
    };

    await sample.save();
    return sample;
  }
}
