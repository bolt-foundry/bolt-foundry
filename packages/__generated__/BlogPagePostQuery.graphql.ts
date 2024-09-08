/**
 * @generated SignedSource<<810b1302056f9f8669edcafa478713f5>>
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
          readonly author: {
            readonly avatarUrl: string | null | undefined;
            readonly email: string | null | undefined;
            readonly name: string | null | undefined;
          } | null | undefined;
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
            readonly icon?: string | null | undefined;
            readonly id: string | null | undefined;
            readonly imgUrl?: string | null | undefined;
            readonly language?: string | null | undefined;
            readonly type: string | null | undefined;
          } | null | undefined> | null | undefined;
          readonly coverUrl: string | null | undefined;
          readonly date: string | null | undefined;
          readonly icon: string | null | undefined;
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
  "name": "date",
  "storageKey": null
},
v6 = {
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
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "coverUrl",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "icon",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v12 = [
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
      (v11/*: any*/),
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
v13 = {
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
      "selections": (v12/*: any*/),
      "storageKey": null
    }
  ],
  "type": "ImageBlock",
  "abstractKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "RichText",
  "kind": "LinkedField",
  "name": "RichText",
  "plural": true,
  "selections": (v12/*: any*/),
  "storageKey": null
},
v15 = {
  "kind": "InlineFragment",
  "selections": [
    (v11/*: any*/),
    (v14/*: any*/)
  ],
  "type": "ParagraphBlock",
  "abstractKey": null
},
v16 = {
  "kind": "InlineFragment",
  "selections": [
    (v11/*: any*/),
    (v8/*: any*/),
    (v14/*: any*/)
  ],
  "type": "CalloutBlock",
  "abstractKey": null
},
v17 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "language",
      "storageKey": null
    },
    (v14/*: any*/)
  ],
  "type": "CodeBlock",
  "abstractKey": null
},
v18 = {
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": true,
                        "selections": [
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v13/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/)
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
          (v18/*: any*/),
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": true,
                        "selections": [
                          (v18/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v13/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/)
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
    "cacheID": "eac163ce9e433bf060f0137a8ffd992b",
    "id": null,
    "metadata": {},
    "name": "BlogPagePostQuery",
    "operationKind": "query",
    "text": "query BlogPagePostQuery(\n  $slug: String!\n) {\n  currentViewer {\n    __typename\n    blog {\n      posts(first: 1, slug: $slug) {\n        nodes {\n          title\n          slug\n          status\n          date\n          author {\n            name\n            email\n            avatarUrl\n          }\n          coverUrl\n          icon\n          content {\n            __typename\n            type\n            id\n            ... on ImageBlock {\n              id\n              type\n              imgUrl\n              caption {\n                text {\n                  content\n                  link\n                }\n                annotations {\n                  bold\n                  code\n                  color\n                  italic\n                  strikethrough\n                  underlined\n                }\n              }\n            }\n            ... on ParagraphBlock {\n              id\n              type\n              color\n              RichText {\n                text {\n                  content\n                  link\n                }\n                annotations {\n                  bold\n                  code\n                  color\n                  italic\n                  strikethrough\n                  underlined\n                }\n              }\n            }\n            ... on CalloutBlock {\n              id\n              type\n              color\n              icon\n              RichText {\n                text {\n                  content\n                  link\n                }\n                annotations {\n                  bold\n                  code\n                  color\n                  italic\n                  strikethrough\n                  underlined\n                }\n              }\n            }\n            ... on CodeBlock {\n              id\n              type\n              language\n              RichText {\n                text {\n                  content\n                  link\n                }\n                annotations {\n                  bold\n                  code\n                  color\n                  italic\n                  strikethrough\n                  underlined\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "88ddea6e3e50e8d431b6c401cc13bd6b";

export default node;
