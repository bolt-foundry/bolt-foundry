/**
 * @generated SignedSource<<27be1f46bc1bc377ef9888bcbe7b03dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SettingsPageQuery$variables = Record<PropertyKey, never>;
export type SettingsPageQuery$data = {
  readonly currentViewer: {
    readonly organization: {
      readonly id: string;
      readonly name: string | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"Media_bfOrganization" | "WatchFolderList_bfOrganization">;
    } | null | undefined;
    readonly person: {
      readonly name: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type SettingsPageQuery = {
  response: SettingsPageQuery$data;
  variables: SettingsPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = [
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
    "name": "SettingsPageQuery",
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
              (v0/*: any*/)
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
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Media_bfOrganization"
              },
              (v1/*: any*/),
              (v0/*: any*/)
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
    "name": "SettingsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
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
                "args": (v3/*: any*/),
                "concreteType": "BfGoogleDriveFolderConnection",
                "kind": "LinkedField",
                "name": "googleDriveFolders",
                "plural": false,
                "selections": [
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
                    "concreteType": "BfGoogleDriveFolderEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BfGoogleDriveFolder",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v0/*: any*/),
                          (v1/*: any*/),
                          (v2/*: any*/)
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
                "args": (v3/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "WatchFolderList_googleDriveFolders",
                "kind": "LinkedHandle",
                "name": "googleDriveFolders"
              },
              (v1/*: any*/),
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 100
                  }
                ],
                "concreteType": "BfMediaConnection",
                "kind": "LinkedField",
                "name": "media",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BfMediaEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BfMedia",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "filename",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "first",
                                "value": 1
                              }
                            ],
                            "concreteType": "BfMediaTranscriptConnection",
                            "kind": "LinkedField",
                            "name": "transcripts",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "BfMediaTranscriptEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "BfMediaTranscript",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "words",
                                        "storageKey": null
                                      },
                                      (v1/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "transcripts(first:1)"
                          },
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "media(first:100)"
              },
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "88a484f826638a1649339d193853f6e3",
    "id": null,
    "metadata": {},
    "name": "SettingsPageQuery",
    "operationKind": "query",
    "text": "query SettingsPageQuery {\n  currentViewer {\n    __typename\n    person {\n      name\n      id\n    }\n    organization {\n      ...WatchFolderList_bfOrganization\n      ...Media_bfOrganization\n      id\n      name\n    }\n  }\n}\n\nfragment Media_bfOrganization on BfOrganization {\n  media(first: 100) {\n    edges {\n      node {\n        filename\n        transcripts(first: 1) {\n          edges {\n            node {\n              words\n              id\n            }\n          }\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment WatchFolderList_bfOrganization on BfOrganization {\n  googleDriveFolders(first: 5) {\n    count\n    edges {\n      node {\n        name\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "93173447903639e5ed937e7f82786ea6";

export default node;
