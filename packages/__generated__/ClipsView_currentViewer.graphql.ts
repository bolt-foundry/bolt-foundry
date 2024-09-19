/**
 * @generated SignedSource<<8736f5e7f1f7146b791cef0ad34d8b68>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipsView_currentViewer$data = {
  readonly __typename: string;
  readonly " $fragmentType": "ClipsView_currentViewer";
};
export type ClipsView_currentViewer$key = {
  readonly " $data"?: ClipsView_currentViewer$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipsView_currentViewer">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipsView_currentViewer",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    }
  ],
  "type": "BfCurrentViewer",
  "abstractKey": "__isBfCurrentViewer"
};

(node as any).hash = "4dee7b35ab6691f8a8165cf0deb2c949";

export default node;
