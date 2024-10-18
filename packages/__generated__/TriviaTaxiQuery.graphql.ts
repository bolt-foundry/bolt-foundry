/**
 * @generated SignedSource<<daac4f53df7b99aebe23277817641f10>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TriviaTaxiQuery$variables = {
  gameExists: boolean;
  gameID: string;
};
export type TriviaTaxiQuery$data = {
  readonly node?: {
    readonly correctResponses?: number | null | undefined;
    readonly id?: string;
    readonly incorrectResponses?: number | null | undefined;
    readonly questions?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: string | null | undefined;
          readonly correct_answer: string | null | undefined;
          readonly difficulty: string | null | undefined;
          readonly id: string;
          readonly incorrect_answers: ReadonlyArray<string | null | undefined> | null | undefined;
          readonly question: string | null | undefined;
          readonly type: string | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type TriviaTaxiQuery = {
  response: TriviaTaxiQuery$data;
  variables: TriviaTaxiQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "gameExists"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "gameID"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "gameID"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "correctResponses",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "incorrectResponses",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 75
    }
  ],
  "concreteType": "BfTTQuestionConnection",
  "kind": "LinkedField",
  "name": "questions",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "BfTTQuestionEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BfTTQuestion",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "type",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "difficulty",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "category",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "question",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "correct_answer",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "incorrect_answers",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "questions(first:75)"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TriviaTaxiQuery",
    "selections": [
      {
        "condition": "gameExists",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "type": "BfTTGame",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ]
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "TriviaTaxiQuery",
    "selections": [
      {
        "condition": "gameExists",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "type": "BfTTGame",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "c538245270dd576a00b21d422057bb8c",
    "id": null,
    "metadata": {},
    "name": "TriviaTaxiQuery",
    "operationKind": "query",
    "text": "query TriviaTaxiQuery(\n  $gameID: ID!\n  $gameExists: Boolean!\n) {\n  node(id: $gameID) @include(if: $gameExists) {\n    __typename\n    ... on BfTTGame {\n      id\n      correctResponses\n      incorrectResponses\n      questions(first: 75) {\n        edges {\n          node {\n            id\n            type\n            difficulty\n            category\n            question\n            correct_answer\n            incorrect_answers\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6eadeaa8e74695f19c4bec0375b2308b";

export default node;
