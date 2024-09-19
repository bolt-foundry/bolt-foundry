/**
 * @generated SignedSource<<03fd1ac14829d4ecd629dce425773956>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationSwitcher_bfOrganization$data = {
  readonly id: string;
  readonly name: string | null | undefined;
  readonly " $fragmentType": "OrganizationSwitcher_bfOrganization";
};
export type OrganizationSwitcher_bfOrganization$key = {
  readonly " $data"?: OrganizationSwitcher_bfOrganization$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationSwitcher_bfOrganization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationSwitcher_bfOrganization",
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
  "type": "BfOrganization",
  "abstractKey": null
};

(node as any).hash = "902542cf506df119fff58a8723a016f9";

export default node;
