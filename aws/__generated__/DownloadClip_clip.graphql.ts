/**
 * @generated SignedSource<<844c6f256db7558e029af043c8fc252d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadClip_clip$data = {
  readonly end_time: number | null | undefined;
  readonly id: string | null | undefined;
  readonly manualCrop: string | null | undefined;
  readonly manualCropActive: boolean | null | undefined;
  readonly start_time: number | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "DownloadClip_clip";
};
export type DownloadClip_clip$key = {
  readonly " $data"?: DownloadClip_clip$data;
  readonly " $fragmentSpreads": FragmentRefs<"DownloadClip_clip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DownloadClip_clip",
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
      "name": "start_time",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "Clip",
  "abstractKey": null
};

(node as any).hash = "5e057a16e68f9a99ae1480e874fb8751";

export default node;
