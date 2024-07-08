/**
 * @generated SignedSource<<e243fec21be5de041ebad07a13ba0c14>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SettingsQuery_me$data = {
  readonly email: string | null | undefined;
  readonly name: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"SettingsProjectTabQuery_me">;
  readonly " $fragmentType": "SettingsQuery_me";
};
export type SettingsQuery_me$key = {
  readonly " $data"?: SettingsQuery_me$data;
  readonly " $fragmentSpreads": FragmentRefs<"SettingsQuery_me">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SettingsQuery_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SettingsProjectTabQuery_me"
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "Person",
  "abstractKey": null
};

(node as any).hash = "705d451077bef6bf4bd12c929f68a220";

export default node;
