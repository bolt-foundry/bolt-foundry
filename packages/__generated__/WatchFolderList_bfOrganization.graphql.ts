/**
 * @generated SignedSource<<72857540284ad9eabf3c28ee49d3dae6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WatchFolderList_bfOrganization$data = {
  readonly googleDriveFolders: {
    readonly count: number | null | undefined;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "WatchFolderList_bfOrganization";
};
export type WatchFolderList_bfOrganization$key = {
  readonly " $data"?: WatchFolderList_bfOrganization$data;
  readonly " $fragmentSpreads": FragmentRefs<"WatchFolderList_bfOrganization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WatchFolderList_bfOrganization",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "BfGoogleDriveFolderConnection",
      "kind": "LinkedField",
      "name": "googleDriveFolders",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "count",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "BfGoogleDriveFolderEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BfGoogleDriveFolder",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
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
                  "name": "id",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "googleDriveFolders(first:20)"
    }
  ],
  "type": "BfOrganization",
  "abstractKey": null
};

(node as any).hash = "fe054790eb688450cc4b6ae6ffe923d7";

export default node;
