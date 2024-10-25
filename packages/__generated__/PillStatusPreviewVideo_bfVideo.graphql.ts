/**
 * @generated SignedSource<<e8aceaab294c349a67fa5e213ccb155c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PillStatusPreviewVideo_bfVideo$data = {
  readonly id: string;
  readonly status: string | null | undefined;
  readonly " $fragmentType": "PillStatusPreviewVideo_bfVideo";
};
export type PillStatusPreviewVideo_bfVideo$key = {
  readonly " $data"?: PillStatusPreviewVideo_bfVideo$data;
  readonly " $fragmentSpreads": FragmentRefs<"PillStatusPreviewVideo_bfVideo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PillStatusPreviewVideo_bfVideo",
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
      "name": "status",
      "storageKey": null
    }
  ],
  "type": "BfMediaNodeVideo",
  "abstractKey": null
};

(node as any).hash = "547954d8282b2dd79f1d240c822a9984";

export default node;
