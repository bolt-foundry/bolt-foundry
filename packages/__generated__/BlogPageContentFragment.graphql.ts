/**
 * @generated SignedSource<<3a63c76576302382a3d67e8c8cdbe0d1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type PostStatus = "DEV_ONLY" | "READY_FOR_PUBLISH" | "WORKSHOP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type BlogPageContentFragment$data = {
  readonly posts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly author: {
          readonly avatarUrl: string | null | undefined;
          readonly email: string | null | undefined;
          readonly name: string | null | undefined;
        } | null | undefined;
        readonly coverUrl: string | null | undefined;
        readonly date: string | null | undefined;
        readonly id: string;
        readonly slug: string | null | undefined;
        readonly status: PostStatus | null | undefined;
        readonly summary: string | null | undefined;
        readonly title: string | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<"BlogPageHeroFragment" | "BlogPageListItemFragment" | "BlogPostContentFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "BlogPageContentFragment";
};
export type BlogPageContentFragment$key = {
  readonly " $data"?: BlogPageContentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BlogPageContentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "status"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "posts"
        ]
      }
    ]
  },
  "name": "BlogPageContentFragment",
  "selections": [
    {
      "alias": "posts",
      "args": [
        {
          "kind": "Variable",
          "name": "status",
          "variableName": "status"
        }
      ],
      "concreteType": "BlogPostConnection",
      "kind": "LinkedField",
      "name": "__Blog_posts_connection",
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
                  "name": "BlogPageHeroFragment"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "BlogPostContentFragment"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "BlogPageListItemFragment"
                },
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
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
    }
  ],
  "type": "Blog",
  "abstractKey": null
};

(node as any).hash = "3bef1ce4a6e1de230412efcf8cf70460";

export default node;
