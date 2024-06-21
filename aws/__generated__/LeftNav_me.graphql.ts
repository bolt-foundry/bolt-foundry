/**
 * @generated SignedSource<<e989cc8596739f55772731769b3002e2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LeftNav_me$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ProjectList_me">;
  readonly " $fragmentType": "LeftNav_me";
};
export type LeftNav_me$key = {
  readonly " $data"?: LeftNav_me$data;
  readonly " $fragmentSpreads": FragmentRefs<"LeftNav_me">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LeftNav_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ProjectList_me"
    }
  ],
  "type": "Person",
  "abstractKey": null
};

(node as any).hash = "a23b00ef61c3cba5bdda928dc9d88b75";

export default node;
