/**
 * @generated SignedSource<<b7eb184f7a5dc67f9fac5ab58481d033>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PillStatusPreviewVideoSubscription$variables = {
  id: string;
};
export type PillStatusPreviewVideoSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"PillStatusPreviewVideo_bfVideo">;
  } | null | undefined;
};
export type PillStatusPreviewVideoSubscription = {
  response: PillStatusPreviewVideoSubscription$data;
  variables: PillStatusPreviewVideoSubscription$variables;
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
    "name": "PillStatusPreviewVideoSubscription",
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
            "name": "PillStatusPreviewVideo_bfVideo"
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
    "name": "PillStatusPreviewVideoSubscription",
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
            "type": "BfMediaNodeVideo",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f08baa7e4e4883f18c84f2bbcb6908a3",
    "id": null,
    "metadata": {},
    "name": "PillStatusPreviewVideoSubscription",
    "operationKind": "subscription",
    "text": "subscription PillStatusPreviewVideoSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...PillStatusPreviewVideo_bfVideo\n    id\n  }\n}\n\nfragment PillStatusPreviewVideo_bfVideo on BfMediaNodeVideo {\n  id\n  status\n}\n"
  }
};
})();

(node as any).hash = "012bdf58eb05f2b71615948c9e6967a9";

export default node;
