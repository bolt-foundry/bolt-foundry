/**
 * @generated SignedSource<<fb72b08923d10c66b7d69c59ebc39820>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResult_bfSavedSearchResult$data = {
  readonly body: string | null | undefined;
  readonly confidence: number | null | undefined;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly rationale: string | null | undefined;
  readonly title: string | null | undefined;
  readonly topics: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditModal_bfSavedSearchResult">;
  readonly " $fragmentType": "SearchResult_bfSavedSearchResult";
};
export type SearchResult_bfSavedSearchResult$key = {
  readonly " $data"?: SearchResult_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchResult_bfSavedSearchResult">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchResult_bfSavedSearchResult",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClipEditModal_bfSavedSearchResult"
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
      "name": "body",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rationale",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "confidence",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "topics",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};

(node as any).hash = "b7a40e2aa46e49819e3d96e580a1b680";

export default node;
