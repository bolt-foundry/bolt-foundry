/**
 * @generated SignedSource<<b0fdbe9be1493fae35734e26c911b37b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BlogPageContentFragment$data = {
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
      readonly status: string | null | undefined;
      readonly summary: string | null | undefined;
      readonly title: string | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"BlogPageHeroFragment" | "BlogPostContentFragment">;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "BlogPageContentFragment";
};
export type BlogPageContentFragment$key = {
  readonly " $data"?: BlogPageContentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BlogPageContentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BlogPageContentFragment",
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "posts(first:10,status:\"Ready for publish\")"
    }
  ],
  "type": "Blog",
  "abstractKey": null
};

(node as any).hash = "99398b15ccabbfb7acc5257eec8cb06b";

export default node;
