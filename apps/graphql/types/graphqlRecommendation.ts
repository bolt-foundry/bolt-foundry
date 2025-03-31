import { objectType } from "nexus";

export const graphqlRecommendationsType = objectType({
  name: "Recommendations",
  definition(t) {
    t.list.field("recommendations", {
      type: graphqlRecommendationType,
      description: "A list of recommendations",
    });
  },
});

export const graphqlRecommendationType = objectType({
  name: "RecommendationItem",
  definition(t) {
    t.string("sourceText");
    t.string("recommendedText");
    t.string("explanation");
    t.float("confidence");
  },
});

export const graphqlYCRecommendationsType = objectType({
  name: "YCRecommendations",
  definition(t) {
    t.field("companySummary", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("productSummary", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("locationDecision", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("progress", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("workLengthHistory", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("techStack", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("revenueSource", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("previousApplicationChange", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("otherIncubators", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("reasonForProductChoice", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("competitors", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("moneyMaking", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("otherIdeas", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("equityBreakdown", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("investmentsReceived", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("reasonForApplying", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
    t.field("whoToldYou", {
      type: graphqlYCRecommendationType,
      description: "A list of recommendations",
    });
  },
});

export const graphqlYCRecommendationType = objectType({
  name: "YCRecommendationItem",
  definition(t) {
    t.string("revision");
    t.string("explanation");
    t.float("confidence");
  },
});
