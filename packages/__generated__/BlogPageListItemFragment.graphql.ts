/**
 * @generated SignedSource<<c1f9fec1cac270ac884d672225356734>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type PostStatus = "DEV_ONLY" | "READY_FOR_PUBLISH" | "WORKSHOP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type BlogPageListItemFragment$data = {
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
  readonly " $fragmentType": "BlogPageListItemFragment";
};
export type BlogPageListItemFragment$key = {
  readonly " $data"?: BlogPageListItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BlogPageListItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BlogPageListItemFragment",
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
  "type": "BlogPost",
  "abstractKey": null
};

(node as any).hash = "7011c15c5f35c8acfc1297bb7c6dd416";

export default node;
