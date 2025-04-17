import { objectType } from "nexus";
import { graphqlBfNode } from "apps/graphql/types/graphqlBfNode.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export const graphqlIdentityType = objectType({
  name: "BfOrganization_Identity",
  definition(t) {
    t.field("twitter", {
      type: objectType({
        name: "Twitter",
        definition(t) {
          t.string("handle");
          t.string("name");
          t.string("imgUrl");
        },
      }),
    });
    t.field("voice", {
      type: objectType({
        name: "Voice",
        definition(t) {
          t.string("voiceSummary");
          t.string("voice");
        },
      }),
    });
  },
});

export const graphqlResearchType = objectType({
  name: "BfOrganization_Research",
  definition(t) {
    t.list.field("topics", {
      type: objectType({
        name: "ResearchTopic",
        definition(t) {
          t.string("name");
          t.list.field("entries", {
            type: objectType({
              name: "ResearchEntry",
              definition(t) {
                t.string("type");
                t.string("name");
                t.string("summary");
                t.string("url");
              },
            }),
          });
        },
      }),
    });
  },
});

export const graphqlCreationType = objectType({
  name: "Creation",
  definition(t) {
    t.string("originalText");
    t.list.field("suggestions", {
      type: objectType({
        name: "Suggestion",
        definition(t) {
          t.string("tweet");
          t.string("explanation");
        },
      }),
    });
    t.string("draftBlog");
    t.list.field("revisions", {
      type: objectType({
        name: "Revisions",
        definition(t) {
          t.string("revisionTitle");
          t.string("original");
          t.string("instructions");
          t.string("revision");
          t.string("explanation");
        },
      }),
    });
  },
});

export const graphqlDistributionType = objectType({
  name: "Distribution",
  definition(t) {
    t.string("tbd");
  },
});

export const graphqlAnalyticsType = objectType({
  name: "Analytics",
  definition(t) {
    t.string("tbd");
  },
});

export const graphqlBfOrganizationType = objectType({
  name: "BfOrganization",
  definition(t) {
    t.implements(graphqlBfNode);
    t.field("identity", {
      type: graphqlIdentityType,
    });
    t.field("research", {
      type: graphqlResearchType,
    });
    t.field("creation", {
      type: graphqlCreationType,
    });
    t.field("distribution", {
      type: graphqlDistributionType,
    });
    t.field("analytics", {
      type: graphqlAnalyticsType,
    });
  },
});
