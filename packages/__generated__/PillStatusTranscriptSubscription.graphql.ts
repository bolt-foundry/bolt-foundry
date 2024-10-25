/**
 * @generated SignedSource<<af070498ee99619ce05c24beaa289d36>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PillStatusTranscriptSubscription$variables = {
  id: string;
};
export type PillStatusTranscriptSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"PillStatusTranscript_bfTranscript">;
  } | null | undefined;
};
export type PillStatusTranscriptSubscription = {
  response: PillStatusTranscriptSubscription$data;
  variables: PillStatusTranscriptSubscription$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PillStatusTranscriptSubscription",
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
            "name": "PillStatusTranscript_bfTranscript"
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
    "name": "PillStatusTranscriptSubscription",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
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
                "kind": "ScalarField",
                "name": "status",
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
    "cacheID": "4ea37f72e7f2e8cffe13de473a7c66a5",
    "id": null,
    "metadata": {},
    "name": "PillStatusTranscriptSubscription",
    "operationKind": "subscription",
    "text": "subscription PillStatusTranscriptSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...PillStatusTranscript_bfTranscript\n    id\n  }\n}\n\nfragment PillStatusTranscript_bfTranscript on BfMediaNodeTranscript {\n  id\n  status\n}\n"
  }
};
})();

(node as any).hash = "46ef98b153ffff59525b8c009dc5ad9e";

export default node;
