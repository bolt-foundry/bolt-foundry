import { objectType } from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfGraphQLFakeClipDataType } from "packages/graphql/types/BfGraphQLFakeClipData.ts";

export const BfGraphQLSavedSearchResultType = objectType({
  name: "BfSavedSearchResult",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("title");
    t.string("body");
    t.string("rationale");
    t.string("description");
    t.float("confidence");
    t.list.string("topics");
    t.boolean("verbatim");
    t.msTime("duration");
    t.msTime("startTime");
    t.msTime("endTime");
    t.connectionField("words", {
      type: BfGraphQLFakeClipDataType,
      resolve: (_a, _b, _c) => {
        return {
          edges: [
            {
              "node": {
                "word": "At",
                "start": 55434,
                "end": 55658,
                "punctuated_word": "At",
                "speaker": "A",
                "id": 3482,
              },
            },
            {
              "node": {
                "word": "Haney",
                "start": 55674,
                "end": 55890,
                "punctuated_word": "Haney",
                "speaker": "A",
                "id": 7081,
              },
            },
            {
              "node": {
                "word": "and",
                "start": 55930,
                "end": 56058,
                "punctuated_word": "and",
                "speaker": "A",
                "id": 9053,
              },
            },
            {
              "node": {
                "word": "company,",
                "start": 56074,
                "end": 56298,
                "punctuated_word": "company,",
                "speaker": "A",
                "id": 2845,
              },
            },
            {
              "node": {
                "word": "the",
                "start": 56354,
                "end": 56522,
                "punctuated_word": "the",
                "speaker": "A",
                "id": 1180,
              },
            },
            {
              "node": {
                "word": "tax",
                "start": 56546,
                "end": 56826,
                "punctuated_word": "tax",
                "speaker": "A",
                "id": 4160,
              },
            },
            {
              "node": {
                "word": "services",
                "start": 56898,
                "end": 57250,
                "punctuated_word": "services",
                "speaker": "A",
                "id": 9377,
              },
            },
            {
              "node": {
                "word": "that",
                "start": 57330,
                "end": 57498,
                "punctuated_word": "that",
                "speaker": "A",
                "id": 2784,
              },
            },
            {
              "node": {
                "word": "we",
                "start": 57514,
                "end": 57642,
                "punctuated_word": "we",
                "speaker": "A",
                "id": 6305,
              },
            },
            {
              "node": {
                "word": "offer",
                "start": 57666,
                "end": 57826,
                "punctuated_word": "offer",
                "speaker": "A",
                "id": 1407,
              },
            },
            {
              "node": {
                "word": "our",
                "start": 57858,
                "end": 58074,
                "punctuated_word": "our",
                "speaker": "A",
                "id": 3524,
              },
            },
            {
              "node": {
                "word": "encompassing",
                "start": 58122,
                "end": 58642,
                "punctuated_word": "encompassing",
                "speaker": "A",
                "id": 6904,
              },
            },
            {
              "node": {
                "word": "of",
                "start": 58666,
                "end": 59230,
                "punctuated_word": "of",
                "speaker": "A",
                "id": 4773,
              },
            },
            {
              "node": {
                "word": "the",
                "start": 59730,
                "end": 60138,
                "punctuated_word": "the",
                "speaker": "A",
                "id": 1599,
              },
            },
            {
              "node": {
                "word": "client's",
                "start": 60194,
                "end": 60626,
                "punctuated_word": "client's",
                "speaker": "A",
                "id": 5631,
              },
            },
            {
              "node": {
                "word": "entire",
                "start": 60658,
                "end": 60978,
                "punctuated_word": "entire",
                "speaker": "A",
                "id": 1322,
              },
            },
            {
              "node": {
                "word": "business,",
                "start": 61034,
                "end": 61634,
                "punctuated_word": "business,",
                "speaker": "A",
                "id": 4310,
              },
            },
            {
              "node": {
                "word": "we",
                "start": 61802,
                "end": 62082,
                "punctuated_word": "we",
                "speaker": "A",
                "id": 2087,
              },
            },
            {
              "node": {
                "word": "really",
                "start": 62106,
                "end": 62290,
                "punctuated_word": "really",
                "speaker": "A",
                "id": 8391,
              },
            },
            {
              "node": {
                "word": "like",
                "start": 62330,
                "end": 62482,
                "punctuated_word": "like",
                "speaker": "A",
                "id": 7320,
              },
            },
            {
              "node": {
                "word": "to",
                "start": 62506,
                "end": 62618,
                "punctuated_word": "to",
                "speaker": "A",
                "id": 5566,
              },
            },
            {
              "node": {
                "word": "look",
                "start": 62634,
                "end": 62762,
                "punctuated_word": "look",
                "speaker": "A",
                "id": 2147,
              },
            },
            {
              "node": {
                "word": "at",
                "start": 62786,
                "end": 63090,
                "punctuated_word": "at",
                "speaker": "A",
                "id": 8905,
              },
            },
            {
              "node": {
                "word": "their",
                "start": 63170,
                "end": 63386,
                "punctuated_word": "their",
                "speaker": "A",
                "id": 6472,
              },
            },
            {
              "node": {
                "word": "entire",
                "start": 63418,
                "end": 63674,
                "punctuated_word": "entire",
                "speaker": "A",
                "id": 9134,
              },
            },
            {
              "node": {
                "word": "business",
                "start": 63722,
                "end": 63978,
                "punctuated_word": "business",
                "speaker": "A",
                "id": 5200,
              },
            },
            {
              "node": {
                "word": "and",
                "start": 64034,
                "end": 64202,
                "punctuated_word": "and",
                "speaker": "A",
                "id": 1259,
              },
            },
            {
              "node": {
                "word": "work",
                "start": 64226,
                "end": 64362,
                "punctuated_word": "work",
                "speaker": "A",
                "id": 4302,
              },
            },
            {
              "node": {
                "word": "through",
                "start": 64386,
                "end": 64522,
                "punctuated_word": "through",
                "speaker": "A",
                "id": 7614,
              },
            },
            {
              "node": {
                "word": "their",
                "start": 64546,
                "end": 64682,
                "punctuated_word": "their",
                "speaker": "A",
                "id": 9283,
              },
            },
            {
              "node": {
                "word": "whole",
                "start": 64706,
                "end": 64890,
                "punctuated_word": "whole",
                "speaker": "A",
                "id": 1610,
              },
            },
            {
              "node": {
                "word": "tax",
                "start": 64930,
                "end": 65154,
                "punctuated_word": "tax",
                "speaker": "A",
                "id": 3791,
              },
            },
            {
              "node": {
                "word": "planning",
                "start": 65202,
                "end": 65570,
                "punctuated_word": "planning",
                "speaker": "A",
                "id": 9843,
              },
            },
            {
              "node": {
                "word": "strategy.",
                "start": 65610,
                "end": 66390,
                "punctuated_word": "strategy.",
                "speaker": "A",
                "id": 6224,
              },
            },
            {
              "node": {
                "word": "We",
                "start": 66770,
                "end": 66930,
                "punctuated_word": "We",
                "speaker": "A",
                "id": 5417,
              },
            },
          ],
        };
      },
    });
  },
});
