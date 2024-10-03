/**
 * @generated SignedSource<<75e38bd8895552d3498834c606818c07>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipEditButton_bfSavedSearchResult$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditModal_bfSavedSearchResult">;
  readonly " $fragmentType": "ClipEditButton_bfSavedSearchResult";
};
export type ClipEditButton_bfSavedSearchResult$key = {
  readonly " $data"?: ClipEditButton_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditButton_bfSavedSearchResult">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipEditButton_bfSavedSearchResult",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClipEditModal_bfSavedSearchResult"
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};

(node as any).hash = "fe155f5871be878e5274ae1c7633da44";

export default node;
