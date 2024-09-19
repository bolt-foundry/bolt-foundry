/**
 * @generated SignedSource<<b22a2ae5a5fbd25233422a5c0c75ed68>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchPageQuery$variables = {
  includeSearchResults: boolean;
  searchId: string;
};
export type ClipSearchPageQuery$data = {
  readonly currentViewer: {
    readonly organization: {
      readonly id: string;
      readonly media: {
        readonly count: number | null | undefined;
      } | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"WatchFolderList_bfOrganization">;
    } | null | undefined;
    readonly person: {
      readonly id: string;
    } | null | undefined;
    readonly searchResults: {
      readonly " $fragmentSpreads": FragmentRefs<"ClipSearchSearchResultList_bfSearchResultConnection" | "SearchForClipsFragment_bfSearchResultConnection">;
    } | null | undefined;
  } | null | undefined;
  readonly node?: {
    readonly __typename: "BfSearchResult";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ClipsView_bfSearchResult">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type ClipSearchPageQuery = {
  response: ClipSearchPageQuery$data;
  variables: ClipSearchPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeSearchResults"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchId"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "BfPerson",
  "kind": "LinkedField",
  "name": "person",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 1
    }
  ],
  "concreteType": "BfMediaConnection",
  "kind": "LinkedField",
  "name": "media",
  "plural": false,
  "selections": [
    (v5/*: any*/)
  ],
  "storageKey": "media(first:1)"
},
v7 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v8 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "searchId"
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "query",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipSearchPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "BfOrganization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "WatchFolderList_bfOrganization"
              },
              (v2/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "BfSearchResultConnection",
            "kind": "LinkedField",
            "name": "searchResults",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ClipSearchSearchResultList_bfSearchResultConnection"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SearchForClipsFragment_bfSearchResultConnection"
              }
            ],
            "storageKey": "searchResults(first:10)"
          }
        ],
        "storageKey": null
      },
      {
        "condition": "includeSearchResults",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v8/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "ClipsView_bfSearchResult"
                  },
                  (v2/*: any*/),
                  (v9/*: any*/)
                ],
                "type": "BfSearchResult",
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
    "name": "ClipSearchPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v9/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "BfOrganization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v10/*: any*/),
                "concreteType": "BfGoogleDriveResourceConnection",
                "kind": "LinkedField",
                "name": "googleDriveFolders",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BfGoogleDriveResourceEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BfGoogleDriveResource",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          (v2/*: any*/),
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
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
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "googleDriveFolders(first:5)"
              },
              {
                "alias": null,
                "args": (v10/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "WatchFolderList_googleDriveFolders",
                "kind": "LinkedHandle",
                "name": "googleDriveFolders"
              },
              (v2/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "BfSearchResultConnection",
            "kind": "LinkedField",
            "name": "searchResults",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "BfSearchResultEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BfSearchResult",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
                      (v2/*: any*/),
                      (v11/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
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
              }
            ],
            "storageKey": "searchResults(first:10)"
          }
        ],
        "storageKey": null
      },
      {
        "condition": "includeSearchResults",
        "kind": "Condition",
        "passingValue": true,
        "selections": [
          {
            "alias": null,
            "args": (v8/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "collectionLength",
                    "storageKey": null
                  },
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v7/*: any*/),
                    "concreteType": "BfSearchResultItemConnection",
                    "kind": "LinkedField",
                    "name": "searchResultItems",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BfSearchResultItemEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "BfSearchResultItem",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": (v3/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "searchResultItems(first:10)"
                  }
                ],
                "type": "BfSearchResult",
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
    "cacheID": "9a1b4273210a3af7349d38fecaa08b56",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageQuery",
    "operationKind": "query",
    "text": "query ClipSearchPageQuery(\n  $searchId: ID!\n  $includeSearchResults: Boolean!\n) {\n  currentViewer {\n    __typename\n    person {\n      id\n    }\n    organization {\n      ...WatchFolderList_bfOrganization\n      id\n      media(first: 1) {\n        count\n      }\n    }\n    searchResults(first: 10) {\n      ...ClipSearchSearchResultList_bfSearchResultConnection\n    }\n  }\n  node(id: $searchId) @include(if: $includeSearchResults) {\n    __typename\n    ... on BfSearchResult {\n      ...ClipsView_bfSearchResult\n      id\n      __typename\n    }\n    id\n  }\n}\n\nfragment ClipSearchResultListItem_bfSearchResult on BfSearchResult {\n  query\n  id\n}\n\nfragment ClipSearchSearchResultList_bfSearchResultConnection on BfSearchResultConnection {\n  count\n  edges {\n    node {\n      __typename\n      id\n      ...ClipSearchResultListItem_bfSearchResult\n    }\n  }\n}\n\nfragment ClipsView_bfSearchResult on BfSearchResult {\n  collectionLength\n  query\n  status\n  searchResultItems(first: 10) {\n    count\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n\nfragment WatchFolderList_bfOrganization on BfOrganization {\n  googleDriveFolders(first: 5) {\n    count\n    edges {\n      node {\n        name\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "b23041e91ec0bff7456f647a22066bb4";

export default node;
