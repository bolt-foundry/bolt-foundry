/**
 * @generated SignedSource<<e4cec7dad7f98b466bf88cd4803bea7c>>
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
  "name": "id",
  "storageKey": null
},
v1 = {
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
        (v0/*: any*/),
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
            "concreteType": "BfOrganization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v1/*: any*/)
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
            "concreteType": "BfOrganization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
    "cacheID": "c8af6f4dd025a5f24ad1535d3b273131",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPageQuery",
    "operationKind": "query",
    "text": "query RandallPlaygroundPageQuery {\n  currentViewer {\n    __typename\n    organization {\n      reviewableClips(first: 10) {\n        nodes {\n          id\n          title\n          mediaUrl\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd2c1f49f02003f8c8e8fdb3136eec6c";

export default node;
