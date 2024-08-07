/**
 * @generated SignedSource<<7ed047203a14685f967f6b0e4c69251d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type RandallPlaygroundPageQuery$variables = Record<PropertyKey, never>;
export type RandallPlaygroundPageQuery$data = {
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
export type RandallPlaygroundPageQuery = {
  response: RandallPlaygroundPageQuery$data;
  variables: RandallPlaygroundPageQuery$variables;
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
    "name": "RandallPlaygroundPageQuery",
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
    "name": "RandallPlaygroundPageQuery",
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
    "cacheID": "7d1fab4dc55dbeaf9e76d8841b07f8d9",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPageQuery",
    "operationKind": "query",
    "text": "query RandallPlaygroundPageQuery {\n  currentViewer {\n    __typename\n    person {\n      name\n      googleAuthAccessToken\n      id\n    }\n    organization {\n      reviewableClips(first: 10) {\n        nodes {\n          id\n          title\n          mediaUrl\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1f59a293cef5bf1dcca89b6c2b7fbf14";

export default node;
