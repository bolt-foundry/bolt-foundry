/**
 * @generated SignedSource<<26e54dac9330ddf2ab0f0c42fb7fe004>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Search_bfSavedSearchConnection$data = {
  readonly __id: string;
  readonly " $fragmentType": "Search_bfSavedSearchConnection";
};
export type Search_bfSavedSearchConnection$key = {
  readonly " $data"?: Search_bfSavedSearchConnection$data;
  readonly " $fragmentSpreads": FragmentRefs<"Search_bfSavedSearchConnection">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Search_bfSavedSearchConnection",
  "selections": [
    {
      "kind": "ClientExtension",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__id",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "BfSavedSearchConnection",
  "abstractKey": null
};

(node as any).hash = "d0ece3ac18bb11ce5e47743530f9c739";

export default node;
