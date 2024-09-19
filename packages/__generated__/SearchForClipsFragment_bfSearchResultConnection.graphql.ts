/**
 * @generated SignedSource<<953bcbb5fe8b90c82fc09436a778fb54>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchForClipsFragment_bfSearchResultConnection$data = {
  readonly __id: string;
  readonly " $fragmentType": "SearchForClipsFragment_bfSearchResultConnection";
};
export type SearchForClipsFragment_bfSearchResultConnection$key = {
  readonly " $data"?: SearchForClipsFragment_bfSearchResultConnection$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchForClipsFragment_bfSearchResultConnection">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchForClipsFragment_bfSearchResultConnection",
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
  "type": "BfSearchResultConnection",
  "abstractKey": null
};

(node as any).hash = "127879da39bcf4d3dbda2b4ef7fbc91c";

export default node;
