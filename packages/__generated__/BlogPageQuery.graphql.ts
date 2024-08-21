/**
 * @generated SignedSource<<4ae21b0720b368cbb76fe2f6ce053ebb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BlogPageQuery$variables = Record<PropertyKey, never>;
export type BlogPageQuery$data = {
  readonly currentViewer: {
    readonly blog: {
      readonly posts: {
        readonly nodes: ReadonlyArray<{
          readonly slug: string | null | undefined;
          readonly title: string | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type BlogPageQuery = {
  response: BlogPageQuery$data;
  variables: BlogPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "concreteType": "Blog",
  "kind": "LinkedField",
  "name": "blog",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "BlogPostConnection",
      "kind": "LinkedField",
      "name": "posts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BlogPost",
          "kind": "LinkedField",
          "name": "nodes",
          "plural": true,
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
              "name": "slug",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "posts(first:10)"
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BlogPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v0/*: any*/)
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
    "name": "BlogPageQuery",
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
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "308140a7271af5a5f71519b511639ced",
    "id": null,
    "metadata": {},
    "name": "BlogPageQuery",
    "operationKind": "query",
    "text": "query BlogPageQuery {\n  currentViewer {\n    __typename\n    blog {\n      posts(first: 10) {\n        nodes {\n          title\n          slug\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "28e7bee42bcdbaff9bf97fc1270e7635";

export default node;
