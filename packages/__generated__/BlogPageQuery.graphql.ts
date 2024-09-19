/**
 * @generated SignedSource<<0b3cc175195fd6c79de071a86b5153e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BlogPageQuery$variables = Record<PropertyKey, never>;
export type BlogPageQuery$data = {
  readonly currentViewer: {
    readonly blog: {
      readonly posts: {
        readonly nodes: ReadonlyArray<{
          readonly slug: string | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"BlogPostContentFragment">;
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "icon",
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
  "name": "color",
  "storageKey": null
},
v7 = [
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
      (v6/*: any*/),
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
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "RichText",
  "kind": "LinkedField",
  "name": "RichText",
  "plural": true,
  "selections": (v7/*: any*/),
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Blog",
            "kind": "LinkedField",
            "name": "blog",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BlogPageContentFragment"
              },
              {
                "alias": null,
                "args": (v0/*: any*/),
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
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "BlogPostContentFragment"
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "posts(first:10,status:\"Ready for publish\")"
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
          (v2/*: any*/),
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
                "args": (v0/*: any*/),
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
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      },
                      (v1/*: any*/),
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
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v8/*: any*/)
                            ],
                            "type": "ParagraphBlock",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/),
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
                                "selections": (v7/*: any*/),
                                "storageKey": null
                              }
                            ],
                            "type": "ImageBlock",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v4/*: any*/),
                              (v8/*: any*/)
                            ],
                            "type": "CalloutBlock",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "language",
                                "storageKey": null
                              },
                              (v8/*: any*/)
                            ],
                            "type": "CodeBlock",
                            "abstractKey": null
                          }
                        ],
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0b1a4630936dd0a582646d4d1929ecd3",
    "id": null,
    "metadata": {},
    "name": "BlogPageQuery",
    "operationKind": "query",
    "text": "query BlogPageQuery {\n  currentViewer {\n    __typename\n    blog {\n      ...BlogPageContentFragment\n      posts(first: 10, status: \"Ready for publish\") {\n        nodes {\n          ...BlogPostContentFragment\n          slug\n        }\n      }\n    }\n  }\n}\n\nfragment BlogPageContentFragment on Blog {\n  posts(first: 10, status: \"Ready for publish\") {\n    nodes {\n      ...BlogPageHeroFragment\n      ...BlogPostContentFragment\n      id\n      title\n      slug\n      status\n      date\n      summary\n      author {\n        name\n        email\n        avatarUrl\n      }\n      coverUrl\n    }\n  }\n}\n\nfragment BlogPageHeroFragment on BlogPost {\n  id\n  title\n  slug\n  status\n  date\n  summary\n  author {\n    name\n    email\n    avatarUrl\n  }\n  coverUrl\n}\n\nfragment BlogPostContentFragment on BlogPost {\n  id\n  title\n  slug\n  status\n  date\n  summary\n  author {\n    name\n    email\n    avatarUrl\n  }\n  coverUrl\n  icon\n  content {\n    __typename\n    ... on ParagraphBlock {\n      id\n      type\n      color\n      RichText {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n    ... on ImageBlock {\n      id\n      type\n      imgUrl\n      caption {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n    ... on CalloutBlock {\n      id\n      type\n      color\n      icon\n      RichText {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n    ... on CodeBlock {\n      id\n      type\n      language\n      RichText {\n        text {\n          content\n          link {\n            url\n          }\n        }\n        annotations {\n          bold\n          code\n          color\n          italic\n          strikethrough\n          underlined\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8feb70cd3e3718d3219633198d4f865f";

export default node;
