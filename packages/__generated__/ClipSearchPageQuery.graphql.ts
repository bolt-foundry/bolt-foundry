/**
 * @generated SignedSource<<733574bdac6740e6b466ebd35a20f914>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchPageQuery$variables = Record<PropertyKey, never>;
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
      readonly savedSearches: {
        readonly " $fragmentSpreads": FragmentRefs<"ClipSearchSidebar_savedSearchConnection" | "Search_bfSavedSearchConnection">;
      } | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"Clip_bfPerson" | "ClipsView_bfPerson">;
    } | null | undefined;
  } | null | undefined;
};
export type ClipSearchPageQuery = {
  response: ClipSearchPageQuery$data;
  variables: ClipSearchPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v3 = {
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
    (v2/*: any*/)
  ],
  "storageKey": "media(first:1)"
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startCursor",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasPreviousPage",
  "storageKey": null
},
v9 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
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
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": (v1/*: any*/),
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
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ClipsView_bfPerson"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Clip_bfPerson"
              }
            ],
            "storageKey": null
          },
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
              (v0/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
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
    "argumentDefinitions": [],
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
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": (v1/*: any*/),
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
                  (v2/*: any*/),
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
                          (v0/*: any*/),
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "savedSearches(first:10)"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "googleAuthAccessToken",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
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
                "args": (v9/*: any*/),
                "concreteType": "BfGoogleDriveResourceConnection",
                "kind": "LinkedField",
                "name": "googleDriveFolders",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
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
                          (v0/*: any*/),
                          (v4/*: any*/)
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
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "googleDriveFolders(first:5)"
              },
              {
                "alias": null,
                "args": (v9/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "WatchFolderList_googleDriveFolders",
                "kind": "LinkedHandle",
                "name": "googleDriveFolders"
              },
              (v0/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bc9a58c6dd55e40b544f59528f5b7fbd",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageQuery",
    "operationKind": "query",
    "text": "query ClipSearchPageQuery {\n  currentViewer {\n    __typename\n    person {\n      id\n      savedSearches(first: 10) {\n        ...ClipSearchSidebar_savedSearchConnection\n      }\n      ...ClipsView_bfPerson\n      ...Clip_bfPerson\n    }\n    organization {\n      ...WatchFolderList_bfOrganization\n      id\n      media(first: 1) {\n        count\n      }\n    }\n  }\n}\n\nfragment ClipSearchSidebar_savedSearchConnection on BfSavedSearchConnection {\n  count\n  edges {\n    node {\n      id\n      query\n    }\n  }\n  pageInfo {\n    startCursor\n    endCursor\n    hasNextPage\n    hasPreviousPage\n  }\n}\n\nfragment Clip_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n\nfragment ClipsView_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n\nfragment WatchFolderList_bfOrganization on BfOrganization {\n  googleDriveFolders(first: 5) {\n    count\n    edges {\n      node {\n        name\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "3030b9b1cc67b327fb4aa10903567f8c";

export default node;
