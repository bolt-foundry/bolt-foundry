/**
 * @generated SignedSource<<4036a328430ce34719a6fc8fe9cf2554>>
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
      readonly savedSearches: {
        readonly __id: string;
        readonly " $fragmentSpreads": FragmentRefs<"ClipSearchSidebar_savedSearchConnection" | "Search_bfSavedSearchConnection">;
      } | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"WatchFolderList_bfOrganization">;
    } | null | undefined;
    readonly person: {
      readonly id: string;
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
    "value": 100
  }
],
v2 = {
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v4 = {
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
    (v3/*: any*/)
  ],
  "storageKey": "media(first:1)"
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startCursor",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasPreviousPage",
  "storageKey": null
},
v10 = [
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
                  },
                  (v2/*: any*/)
                ],
                "storageKey": "savedSearches(first:100)"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "WatchFolderList_bfOrganization"
              },
              (v0/*: any*/),
              (v4/*: any*/)
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
          (v5/*: any*/),
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
                "args": (v1/*: any*/),
                "concreteType": "BfSavedSearchConnection",
                "kind": "LinkedField",
                "name": "savedSearches",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
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
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "savedSearches(first:100)"
              },
              {
                "alias": null,
                "args": (v10/*: any*/),
                "concreteType": "BfGoogleDriveResourceConnection",
                "kind": "LinkedField",
                "name": "googleDriveFolders",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
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
                          (v5/*: any*/)
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
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v6/*: any*/)
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
              (v0/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "834cdbdc981122fce75a657b3add8104",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageQuery",
    "operationKind": "query",
    "text": "query ClipSearchPageQuery {\n  currentViewer {\n    __typename\n    person {\n      id\n      ...ClipsView_bfPerson\n      ...Clip_bfPerson\n    }\n    organization {\n      savedSearches(first: 100) {\n        ...ClipSearchSidebar_savedSearchConnection\n      }\n      ...WatchFolderList_bfOrganization\n      id\n      media(first: 1) {\n        count\n      }\n    }\n  }\n}\n\nfragment ClipSearchSidebar_savedSearchConnection on BfSavedSearchConnection {\n  count\n  edges {\n    node {\n      id\n      query\n    }\n  }\n  pageInfo {\n    startCursor\n    endCursor\n    hasNextPage\n    hasPreviousPage\n  }\n}\n\nfragment Clip_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n\nfragment ClipsView_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n\nfragment WatchFolderList_bfOrganization on BfOrganization {\n  googleDriveFolders(first: 5) {\n    count\n    edges {\n      node {\n        name\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "0a203de9bfe27fe02332c5c8c564f500";

export default node;
