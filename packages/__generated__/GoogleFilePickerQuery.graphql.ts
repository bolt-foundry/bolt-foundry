/**
 * @generated SignedSource<<f2f88500639b8ce2c65bf002dffde581>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GoogleFilePickerQuery$variables = Record<PropertyKey, never>;
export type GoogleFilePickerQuery$data = {
  readonly currentViewer: {
    readonly organization: {
      readonly reviewableClips: {
        readonly nodes: ReadonlyArray<{
          readonly id: string;
          readonly mediaUrl: any | null | undefined;
          readonly title: string | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly person: {
      readonly googleAuthAccessToken: string | null | undefined;
      readonly name: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type GoogleFilePickerQuery = {
  response: GoogleFilePickerQuery$data;
  variables: GoogleFilePickerQuery$variables;
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
  "name": "googleAuthAccessToken",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 10
    }
  ],
  "concreteType": "BfClipReviewConnection",
  "kind": "LinkedField",
  "name": "reviewableClips",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "BfClipReview",
      "kind": "LinkedField",
      "name": "nodes",
      "plural": true,
      "selections": [
        (v2/*: any*/),
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
          "name": "mediaUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "reviewableClips(first:10)"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleFilePickerQuery",
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
    "name": "GoogleFilePickerQuery",
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
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
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
            "concreteType": "BfOrganization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
    "cacheID": "6e14b7a7d26b664aec52389925ed60b0",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerQuery",
    "operationKind": "query",
    "text": "query GoogleFilePickerQuery {\n  currentViewer {\n    __typename\n    person {\n      name\n      googleAuthAccessToken\n      id\n    }\n    organization {\n      reviewableClips(first: 10) {\n        nodes {\n          id\n          title\n          mediaUrl\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "44f7de88b1992fc01aae512371d05577";

export default node;
