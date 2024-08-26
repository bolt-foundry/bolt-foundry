/**
 * @generated SignedSource<<26f43fc987652a10a4b2295559861821>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BlogPagePostQuery$variables = {
  slug: string;
};
export type BlogPagePostQuery$data = {
  readonly currentViewer: {
    readonly blog: {
      readonly posts: {
        readonly nodes: ReadonlyArray<{
          readonly content: ReadonlyArray<{
            readonly RichText?: ReadonlyArray<{
              readonly annotations: {
                readonly bold: boolean | null | undefined;
                readonly code: boolean | null | undefined;
                readonly color: string | null | undefined;
                readonly italic: boolean | null | undefined;
                readonly strikethrough: boolean | null | undefined;
                readonly underlined: boolean | null | undefined;
              } | null | undefined;
              readonly text: {
                readonly content: string | null | undefined;
                readonly link: string | null | undefined;
              } | null | undefined;
            } | null | undefined> | null | undefined;
            readonly caption?: ReadonlyArray<{
              readonly annotations: {
                readonly bold: boolean | null | undefined;
                readonly code: boolean | null | undefined;
                readonly color: string | null | undefined;
                readonly italic: boolean | null | undefined;
                readonly strikethrough: boolean | null | undefined;
                readonly underlined: boolean | null | undefined;
              } | null | undefined;
              readonly text: {
                readonly content: string | null | undefined;
                readonly link: string | null | undefined;
              } | null | undefined;
            } | null | undefined> | null | undefined;
            readonly color?: string | null | undefined;
            readonly id: string | null | undefined;
            readonly imgUrl?: string | null | undefined;
            readonly type: string | null | undefined;
          } | null | undefined> | null | undefined;
          readonly slug: string | null | undefined;
          readonly status: string | null | undefined;
          readonly title: string | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type BlogPagePostQuery = {
  response: BlogPagePostQuery$data;
  variables: BlogPagePostQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Text",
    "kind": "LinkedField",
    "name": "text",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "content",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "link",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Annotations",
    "kind": "LinkedField",
    "name": "annotations",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "bold",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "code",
        "storageKey": null
      },
      (v7/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "italic",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "strikethrough",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "underlined",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v9 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imgUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "RichText",
      "kind": "LinkedField",
      "name": "caption",
      "plural": true,
      "selections": (v8/*: any*/),
      "storageKey": null
    }
  ],
  "type": "ImageBlock",
  "abstractKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": [
    (v7/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "RichText",
      "kind": "LinkedField",
      "name": "RichText",
      "plural": true,
      "selections": (v8/*: any*/),
      "storageKey": null
    }
  ],
  "type": "ParagraphBlock",
  "abstractKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BlogPagePostQuery",
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
            "concreteType": "Blog",
            "kind": "LinkedField",
            "name": "blog",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v1/*: any*/),
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
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": true,
                        "selections": [
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BlogPagePostQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Blog",
            "kind": "LinkedField",
            "name": "blog",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v1/*: any*/),
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
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": true,
                        "selections": [
                          (v11/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4778e2b9b79e7c14a097165ac2f119d6",
    "id": null,
    "metadata": {},
    "name": "BlogPagePostQuery",
    "operationKind": "query",
    "text": "query BlogPagePostQuery(\n  $slug: String!\n) {\n  currentViewer {\n    __typename\n    blog {\n      posts(first: 1, slug: $slug) {\n        nodes {\n          title\n          slug\n          status\n          content {\n            __typename\n            type\n            id\n            ... on ImageBlock {\n              id\n              type\n              imgUrl\n              caption {\n                text {\n                  content\n                  link\n                }\n                annotations {\n                  bold\n                  code\n                  color\n                  italic\n                  strikethrough\n                  underlined\n                }\n              }\n            }\n            ... on ParagraphBlock {\n              id\n              type\n              color\n              RichText {\n                text {\n                  content\n                  link\n                }\n                annotations {\n                  bold\n                  code\n                  color\n                  italic\n                  strikethrough\n                  underlined\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d60ef6a966ad6fb1d125e15a955eb7be";

export default node;
