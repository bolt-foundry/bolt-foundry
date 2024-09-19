/**
 * @generated SignedSource<<d025afd06ad1b8b7dba74c10e1d994c1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PostStatus = "DEV_ONLY" | "READY_FOR_PUBLISH" | "%future added value";
export type BlogPageQuery$variables = {
  status?: ReadonlyArray<PostStatus> | null | undefined;
};
export type BlogPageQuery$data = {
  readonly currentViewer: {
    readonly blog: {
      readonly posts: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly slug: string | null | undefined;
            readonly " $fragmentSpreads": FragmentRefs<"BlogPostContentFragment">;
          } | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"BlogPageContentFragment">;
    } | null | undefined;
  } | null | undefined;
};
export type BlogPageQuery = {
  response: BlogPageQuery$data;
  variables: BlogPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v1/*: any*/)
],
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
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "icon",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v9 = [
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
        "concreteType": "Link",
        "kind": "LinkedField",
        "name": "link",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "url",
            "storageKey": null
          }
        ],
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
      (v8/*: any*/),
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
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "RichText",
  "kind": "LinkedField",
  "name": "RichText",
  "plural": true,
  "selections": (v9/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Blog",
            "kind": "LinkedField",
            "name": "blog",
            "plural": false,
            "selections": [
              {
                "args": [
                  (v1/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "BlogPageContentFragment"
              },
              {
                "alias": null,
                "args": (v2/*: any*/),
                "concreteType": "BlogPostConnection",
                "kind": "LinkedField",
                "name": "posts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BlogPostEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BlogPost",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "BlogPostContentFragment"
                          },
                          (v3/*: any*/)
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
          (v4/*: any*/),
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
                "args": (v2/*: any*/),
                "concreteType": "BlogPostConnection",
                "kind": "LinkedField",
                "name": "posts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BlogPostEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "BlogPost",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "status",
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
                            "kind": "ScalarField",
                            "name": "summary",
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
                          },
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "content",
                            "plural": true,
                            "selections": [
                              (v4/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v5/*: any*/),
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v10/*: any*/)
                                ],
                                "type": "ParagraphBlock",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v5/*: any*/),
                                  (v7/*: any*/),
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
                                    "selections": (v9/*: any*/),
                                    "storageKey": null
                                  }
                                ],
                                "type": "ImageBlock",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v5/*: any*/),
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v6/*: any*/),
                                  (v10/*: any*/)
                                ],
                                "type": "CalloutBlock",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v5/*: any*/),
                                  (v7/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "language",
                                    "storageKey": null
                                  },
                                  (v10/*: any*/)
                                ],
                                "type": "CodeBlock",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v2/*: any*/),
                "filters": [
                  "status"
                ],
                "handle": "connection",
                "key": "Blog_posts",
                "kind": "LinkedHandle",
                "name": "posts"
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
    "cacheID": "e41d803b6bde9dbcb9ab2763a45b7fa6",
    "id": null,
    "metadata": {},
    "name": "BlogPageQuery",
    "operationKind": "query",
    "text": "query BlogPageQuery(\n  $status: [PostStatus!]\n) {\n  currentViewer {\n    __typename\n    blog {\n      ...BlogPageContentFragment_lg5YC\n      posts(first: 10, status: $status) {\n        edges {\n          node {\n            ...BlogPostContentFragment\n            slug\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment BlogPageContentFragment_lg5YC on Blog {\n  posts(first: 10, status: $status) {\n    edges {\n      node {\n        ...BlogPageHeroFragment\n        ...BlogPostContentFragment\n        ...BlogPageListItemFragment\n        id\n        title\n        slug\n        status\n        date\n        summary\n        author {\n          name\n          email\n          avatarUrl\n        }\n        coverUrl\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment BlogPageHeroFragment on BlogPost {\n  id\n  title\n  slug\n  status\n  date\n  summary\n  author {\n    name\n    email\n    avatarUrl\n  }\n  coverUrl\n}\n\nfragment BlogPageListItemFragment on BlogPost {\n  id\n  title\n  slug\n  status\n  date\n  summary\n  author {\n    name\n    email\n    avatarUrl\n  }\n  coverUrl\n}\n\nfragment BlogPostContentFragment on BlogPost {\n  id\n  title\n  slug\n  status\n  date\n  summary\n  author {\n    name\n    email\n    avatarUrl\n  }\n  coverUrl\n  icon\n  content {\n    __typename\n    ... on ParagraphBlock {\n      id\n      type\n      color\n      RichText {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n    ... on ImageBlock {\n      id\n      type\n      imgUrl\n      caption {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n    ... on CalloutBlock {\n      id\n      type\n      color\n      icon\n      RichText {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n    ... on CodeBlock {\n      id\n      type\n      language\n      RichText {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "befdac54d5c453aa7ae69be075b8104c";

export default node;
