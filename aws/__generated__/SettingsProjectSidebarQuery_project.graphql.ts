/**
 * @generated SignedSource<<eb103c467411ad3b15f4c6aaa29c5462>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SettingsProjectSidebarQuery_project$data = {
  readonly effectiveSettings: {
    readonly " $fragmentSpreads": FragmentRefs<"SettingsFormQuery_settings">;
  } | null | undefined;
  readonly id: string | null | undefined;
  readonly overriddenSettingsKeys: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly " $fragmentType": "SettingsProjectSidebarQuery_project";
};
export type SettingsProjectSidebarQuery_project$key = {
  readonly " $data"?: SettingsProjectSidebarQuery_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"SettingsProjectSidebarQuery_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SettingsProjectSidebarQuery_project",
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
      "name": "effectiveSettings",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SettingsFormQuery_settings"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "overriddenSettingsKeys",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "e3411004f4d81e80de6cf94d149c5efa";

export default node;
