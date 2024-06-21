/**
 * @generated SignedSource<<c5fa31cd8788fb1f7935c9a7abd47015>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SettingsProjectTabQuery_me$data = {
  readonly id: string | null | undefined;
  readonly settings: {
    readonly " $fragmentSpreads": FragmentRefs<"SettingsFormQuery_settings">;
  } | null | undefined;
  readonly " $fragmentType": "SettingsProjectTabQuery_me";
};
export type SettingsProjectTabQuery_me$key = {
  readonly " $data"?: SettingsProjectTabQuery_me$data;
  readonly " $fragmentSpreads": FragmentRefs<"SettingsProjectTabQuery_me">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SettingsProjectTabQuery_me",
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
      "concreteType": "Settings",
      "kind": "LinkedField",
      "name": "settings",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SettingsFormQuery_settings"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Person",
  "abstractKey": null
};

(node as any).hash = "84b9d2fd68eb078eb08bb1db44687fb8";

export default node;
