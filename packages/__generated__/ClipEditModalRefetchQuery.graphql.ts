/**
 * @generated SignedSource<<ce0faf1f874ac00b15b299fe2ee7f0f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipEditModalRefetchQuery$variables = {
  endTime?: any | null | undefined;
  id: string;
  startTime?: any | null | undefined;
};
export type ClipEditModalRefetchQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"ClipEditModal_bfSavedSearchResult">;
  } | null | undefined;
};
export type ClipEditModalRefetchQuery = {
  response: ClipEditModalRefetchQuery$data;
  variables: ClipEditModalRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "endTime"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "startTime"
},
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v4 = [
  {
    "kind": "Variable",
    "name": "endTime",
    "variableName": "endTime"
  },
  {
    "kind": "Variable",
    "name": "startTime",
    "variableName": "startTime"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startTime",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endTime",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipEditModalRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": (v4/*: any*/),
            "kind": "FragmentSpread",
            "name": "ClipEditModal_bfSavedSearchResult"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClipEditModalRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
                "name": "title",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": (v4/*: any*/),
                "concreteType": "Word",
                "kind": "LinkedField",
                "name": "words",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "text",
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "speaker",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "BfSavedSearchResult",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8c1e82a4bdfcfe2361c88ac3483adc20",
    "id": null,
    "metadata": {},
    "name": "ClipEditModalRefetchQuery",
    "operationKind": "query",
    "text": "query ClipEditModalRefetchQuery(\n  $endTime: TimecodeInMilliseconds\n  $startTime: TimecodeInMilliseconds\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...ClipEditModal_bfSavedSearchResult_3uKjWt\n    id\n  }\n}\n\nfragment ClipEditModal_bfSavedSearchResult_3uKjWt on BfSavedSearchResult {\n  id\n  title\n  description\n  startTime\n  endTime\n  words(startTime: $startTime, endTime: $endTime) {\n    text\n    startTime\n    endTime\n    speaker\n  }\n}\n"
  }
};
})();

(node as any).hash = "3ff84d0ebc06cc87381f92f23c415e42";

export default node;
