/**
 * @generated SignedSource<<a3ef9fbf14874a6fa4346fdca764a243>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Search_bfCollection$data = {
  readonly id: string;
  readonly " $fragmentType": "Search_bfCollection";
};
export type Search_bfCollection$key = {
  readonly " $data"?: Search_bfCollection$data;
  readonly " $fragmentSpreads": FragmentRefs<"Search_bfCollection">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Search_bfCollection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "BfCollection",
  "abstractKey": null
};

(node as any).hash = "255cf26f887050386ab4abddc89c0982";

export default node;
