/**
 * @generated SignedSource<<2e3d7bf99e171da477a43cfbe86ec599>>
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
          readonly author: {
            readonly avatarUrl: string | null | undefined;
            readonly email: string | null | undefined;
            readonly name: string | null | undefined;
          } | null | undefined;
          readonly coverUrl: string | null | undefined;
          readonly date: string | null | undefined;
          readonly id: string;
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
        },
        {
          "kind": "Literal",
          "name": "status",
          "value": "Ready for publish"
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
              "name": "id",
              "storageKey": null
            },
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "date",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BlogPostAuthor",
              "kind": "LinkedField",
              "name": "author",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "email",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "avatarUrl",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "coverUrl",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "posts(first:10,status:\"Ready for publish\")"
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
    "cacheID": "33c34417ec34c4f2a0accc2c6b41fbdb",
    "id": null,
    "metadata": {},
    "name": "BlogPageQuery",
    "operationKind": "query",
    "text": "query BlogPageQuery {\n  currentViewer {\n    __typename\n    blog {\n      posts(first: 10, status: \"Ready for publish\") {\n        nodes {\n          id\n          title\n          slug\n          date\n          author {\n            name\n            email\n            avatarUrl\n          }\n          coverUrl\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "087666c7817b11c0185647552a464504";

export default node;
