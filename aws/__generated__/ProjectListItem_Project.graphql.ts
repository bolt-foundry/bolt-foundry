/**
 * @generated SignedSource<<0059eae22d63e5f9931508ff57fca402>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectListItem_Project$data = {
  readonly id: string | null | undefined;
  readonly name: string | null | undefined;
  readonly " $fragmentType": "ProjectListItem_Project";
};
export type ProjectListItem_Project$key = {
  readonly " $data"?: ProjectListItem_Project$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectListItem_Project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectListItem_Project",
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
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "8a758c2ffc7e654170a98d6bddd2c8ea";

export default node;
