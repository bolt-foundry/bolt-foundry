/**
 * @generated SignedSource<<4601c5da8a5c3cb160c08b8a2d770cf3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchResultListItem_bfSearchResult$data = {
  readonly id: string;
  readonly query: string | null | undefined;
  readonly " $fragmentType": "ClipSearchResultListItem_bfSearchResult";
};
export type ClipSearchResultListItem_bfSearchResult$key = {
  readonly " $data"?: ClipSearchResultListItem_bfSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipSearchResultListItem_bfSearchResult">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipSearchResultListItem_bfSearchResult",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "query",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "BfSearchResult",
  "abstractKey": null
};

(node as any).hash = "6aa2ceacc09b6a7c16febf8dbe93cadb";

export default node;
