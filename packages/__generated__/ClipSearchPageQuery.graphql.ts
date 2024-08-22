/**
 * @generated SignedSource<<3839305b566156c9c0f6432b8fe82dd3>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v2 = {
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
    (v1/*: any*/)
  ],
  "storageKey": "media(first:1)"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = [
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "WatchFolderList_bfOrganization"
              },
              (v0/*: any*/),
              (v2/*: any*/)
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
          (v3/*: any*/),
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
                "args": (v4/*: any*/),
                "concreteType": "BfGoogleDriveResourceConnection",
                "kind": "LinkedField",
                "name": "googleDriveFolders",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
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
                          (v3/*: any*/)
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
                "args": (v4/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "WatchFolderList_googleDriveFolders",
                "kind": "LinkedHandle",
                "name": "googleDriveFolders"
              },
              (v0/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "dbd2589af4624018b96f455a3aa8603c",
    "id": null,
    "metadata": {},
    "name": "ClipSearchPageQuery",
    "operationKind": "query",
    "text": "query ClipSearchPageQuery {\n  currentViewer {\n    __typename\n    person {\n      id\n      ...ClipsView_bfPerson\n      ...Clip_bfPerson\n    }\n    organization {\n      ...WatchFolderList_bfOrganization\n      id\n      media(first: 1) {\n        count\n      }\n    }\n  }\n}\n\nfragment Clip_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n\nfragment ClipsView_bfPerson on BfPerson {\n  googleAuthAccessToken\n}\n\nfragment WatchFolderList_bfOrganization on BfOrganization {\n  googleDriveFolders(first: 5) {\n    count\n    edges {\n      node {\n        name\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "f2522c6a3d0565ff302a96ffef2bd11a";

export default node;
