/**
 * @generated SignedSource<<21591ff254ac3a80891f0f0e6d9a5325>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ManualCropMenu_clip$data = {
  readonly id: string | null | undefined;
  readonly manualCrop: string | null | undefined;
  readonly manualCropActive: boolean | null | undefined;
  readonly " $fragmentType": "ManualCropMenu_clip";
};
export type ManualCropMenu_clip$key = {
  readonly " $data"?: ManualCropMenu_clip$data;
  readonly " $fragmentSpreads": FragmentRefs<"ManualCropMenu_clip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ManualCropMenu_clip",
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
      "name": "manualCrop",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "manualCropActive",
      "storageKey": null
    }
  ],
  "type": "Clip",
  "abstractKey": null
};

(node as any).hash = "ea0069b88c109e59c04a12302e4f7d78";

export default node;
