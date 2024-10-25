/**
 * @generated SignedSource<<39d81cf8a49099ece42869244e535bd8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TranscriptWordCountSubscription$variables = {
  id: string;
};
export type TranscriptWordCountSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"TranscriptWordCount_bfTranscript">;
  } | null | undefined;
};
export type TranscriptWordCountSubscription = {
  response: TranscriptWordCountSubscription$data;
  variables: TranscriptWordCountSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TranscriptWordCountSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TranscriptWordCount_bfTranscript"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TranscriptWordCountSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AssemblyAIWord",
                "kind": "LinkedField",
                "name": "words",
                "plural": true,
                "selections": [
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "BfMediaNodeTranscript",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fff31221d5d9d3265729dc8419dadfd9",
    "id": null,
    "metadata": {},
    "name": "TranscriptWordCountSubscription",
    "operationKind": "subscription",
    "text": "subscription TranscriptWordCountSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...TranscriptWordCount_bfTranscript\n    id\n  }\n}\n\nfragment TranscriptWordCount_bfTranscript on BfMediaNodeTranscript {\n  id\n  words {\n    __typename\n  }\n}\n"
  }
};
})();

(node as any).hash = "06972208d909a581129ddb9ecf3e1880";

export default node;
