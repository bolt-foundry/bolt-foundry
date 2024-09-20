/**
 * @generated SignedSource<<22c9aa7b63fa566052304a5084beb86b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type PostStatus = "DEV_ONLY" | "READY_FOR_PUBLISH" | "WORKSHOP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type BlogPageHeroFragment$data = {
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
  readonly " $fragmentType": "BlogPageHeroFragment";
};
export type BlogPageHeroFragment$key = {
  readonly " $data"?: BlogPageHeroFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BlogPageHeroFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BlogPageHeroFragment",
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

(node as any).hash = "012be9eb40aa961e3c82879a3f35c3e4";

export default node;
