/**
 * @generated SignedSource<<953ab2a9110fff6656ed9b24faea73b2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipsView_bfPerson$data = {
  readonly googleAuthAccessToken: string | null | undefined;
  readonly " $fragmentType": "ClipsView_bfPerson";
};
export type ClipsView_bfPerson$key = {
  readonly " $data"?: ClipsView_bfPerson$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipsView_bfPerson">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipsView_bfPerson",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "googleAuthAccessToken",
      "storageKey": null
    }
  ],
  "type": "BfPerson",
  "abstractKey": null
};

(node as any).hash = "2fffa9fc80c47e5df10ef5dbf00ea16e";

export default node;
