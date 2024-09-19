/**
 * @generated SignedSource<<ef410ec73f9c9373479b2a5e1568c289>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResultItem_bfPerson$data = {
  readonly googleAuthAccessToken: string | null | undefined;
  readonly " $fragmentType": "SearchResultItem_bfPerson";
};
export type SearchResultItem_bfPerson$key = {
  readonly " $data"?: SearchResultItem_bfPerson$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchResultItem_bfPerson">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchResultItem_bfPerson",
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

(node as any).hash = "3830103c0ab42262133cbe0fc407fb97";

export default node;
