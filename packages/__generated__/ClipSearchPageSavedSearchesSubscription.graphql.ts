/**
 * @generated SignedSource<<c3be5c7875d8b06d0c57abd7d0803241>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchPageSavedSearchesSubscription$variables = {
  id: string;
};
export type ClipSearchPageSavedSearchesSubscription$data = {
  readonly node: {
    readonly savedSearches?: {
      readonly " $fragmentSpreads": FragmentRefs<"ClipSearchSidebar_savedSearchConnection" | "Search_bfSavedSearchConnection">;
    } | null | undefined;
  } | null | undefined;
};
export type ClipSearchPageSavedSearchesSubscription = {
  response: ClipSearchPageSavedSearchesSubscription$data;
  variables: ClipSearchPageSavedSearchesSubscription$variables;
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
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipSearchPageSavedSearchesSubscription",
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
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v2/*: any*/),
                "concreteType": "BfSavedSearchConnection",
                "kind": "LinkedField",
                "name": "savedSearches",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Search_bfSavedSearchConnection"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "ClipSearchSidebar_savedSearchConnection"
                  }
                ],
                "storageKey": "savedSearches(first:10)"
              }
            ],
            "type": "BfPerson",
            "abstractKey": null
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
    "name": "ClipSearchPageSavedSearchesSubscription",
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
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v2/*: any*/),
                "concreteType": "BfSavedSearchConnection",
                "kind": "LinkedField",
                "name": "savedSearches",
                "plural": false,
                "selections": [
                  {
                    "kind": "ClientExtension",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__id",
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "count",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BfSavedSearchEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BfSavedSearch",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "query",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endCursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasPreviousPage",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "savedSearches(first:10)"
              }
            ],
            "type": "BfPerson",
            "abstractKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e03131b5a47c2ead2c4df3379bf40e67",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageSavedSearchesSubscription",
    "operationKind": "subscription",
    "text": "subscription ClipSearchPageSavedSearchesSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on BfPerson {\n      savedSearches(first: 10) {\n        ...ClipSearchSidebar_savedSearchConnection\n      }\n    }\n    id\n  }\n}\n\nfragment ClipSearchSidebar_savedSearchConnection on BfSavedSearchConnection {\n  count\n  edges {\n    node {\n      id\n      query\n    }\n  }\n  pageInfo {\n    startCursor\n    endCursor\n    hasNextPage\n    hasPreviousPage\n  }\n}\n"
  }
};
})();

(node as any).hash = "6333fd8ca6e999fe0de3ac2c95fddd02";

export default node;
