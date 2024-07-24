/**
 * @generated SignedSource<<2d9a6f99affc27823282eb6fe35a9097>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useClipEditData_clip$data = {
  readonly description: string | null | undefined;
  readonly downloadUrl: string | null | undefined;
  readonly encodingStatus: string | null | undefined;
  readonly endTimeOverride: number | null | undefined;
  readonly end_index: number | null | undefined;
  readonly end_time: number | null | undefined;
  readonly id: string | null | undefined;
  readonly manualCrop: string | null | undefined;
  readonly manualCropActive: boolean | null | undefined;
  readonly start_index: number | null | undefined;
  readonly start_time: number | null | undefined;
  readonly text: string | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ChangeRequestButton_clip" | "DownloadClip_clip" | "ManualCropMenu_clip" | "StarClipButton_clip">;
  readonly " $fragmentType": "useClipEditData_clip";
};
export type useClipEditData_clip$key = {
  readonly " $data"?: useClipEditData_clip$data;
  readonly " $fragmentSpreads": FragmentRefs<"useClipEditData_clip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "useClipEditData_clip",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "StarClipButton_clip"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ChangeRequestButton_clip"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ManualCropMenu_clip"
    },
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
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "downloadUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "encodingStatus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "end_index",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "end_time",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endTimeOverride",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "start_index",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "start_time",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "text",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DownloadClip_clip"
    }
  ],
  "type": "Clip",
  "abstractKey": null
};

(node as any).hash = "f6316a86e82f805ef625f5e39aa68765";

export default node;
