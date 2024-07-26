/**
 * @generated SignedSource<<b0817753ee8aaa1b4c6df72c6dcb0c9a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IBfOrganizationsPage_BfOrganization$data = {
  readonly name: string | null | undefined;
  readonly " $fragmentType": "IBfOrganizationsPage_BfOrganization";
};
export type IBfOrganizationsPage_BfOrganization$key = {
  readonly " $data"?: IBfOrganizationsPage_BfOrganization$data;
  readonly " $fragmentSpreads": FragmentRefs<"IBfOrganizationsPage_BfOrganization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IBfOrganizationsPage_BfOrganization",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "BfOrganization",
  "abstractKey": null
};

(node as any).hash = "f9ddc5ec741f7f8eb9b3607f61618ef3";

export default node;
