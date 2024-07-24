/**
 * @generated SignedSource<<0effb5ecdb7e166f0a524b3b9e4517ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChangeRequestButton_clip$data = {
  readonly changeRequested: boolean | null | undefined;
  readonly id: string | null | undefined;
  readonly " $fragmentType": "ChangeRequestButton_clip";
};
export type ChangeRequestButton_clip$key = {
  readonly " $data"?: ChangeRequestButton_clip$data;
  readonly " $fragmentSpreads": FragmentRefs<"ChangeRequestButton_clip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ChangeRequestButton_clip",
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
      "name": "changeRequested",
      "storageKey": null
    }
  ],
  "type": "Clip",
  "abstractKey": null
};

(node as any).hash = "ea1b4b4cf91df247250d53cb10dbf036";

export default node;
