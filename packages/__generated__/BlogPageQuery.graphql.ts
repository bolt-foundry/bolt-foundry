/**
 * @generated SignedSource<<4c3e2dcd8d995f3dd4a6ad16a882c64f>>
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
        readonly count: number | null | undefined;
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
          "kind": "ScalarField",
          "name": "count",
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
    "cacheID": "84a1e06ef721cdd2f48b4214aaf42994",
    "id": null,
    "metadata": {},
    "name": "BlogPageQuery",
    "operationKind": "query",
    "text": "query BlogPageQuery {\n  currentViewer {\n    __typename\n    blog {\n      posts(first: 10) {\n        count\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b844422ff45bb736a256771b0f97d368";

export default node;
