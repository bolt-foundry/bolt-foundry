/**
 * @generated SignedSource<<5552ec93c7dafd63d47efb5d2707c8f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Clip_bfPerson$data = {
  readonly googleAuthAccessToken: string | null | undefined;
  readonly " $fragmentType": "Clip_bfPerson";
};
export type Clip_bfPerson$key = {
  readonly " $data"?: Clip_bfPerson$data;
  readonly " $fragmentSpreads": FragmentRefs<"Clip_bfPerson">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Clip_bfPerson",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "googleAuthAccessToken",
      "storageKey": null
    }
  ],
  "type": "BfPerson",
  "abstractKey": null
};

(node as any).hash = "218695ba36679ea50a595551b65b4961";

export default node;
