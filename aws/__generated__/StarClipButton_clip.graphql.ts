/**
 * @generated SignedSource<<2ac5b3465235011427ae23e55eddb0ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StarClipButton_clip$data = {
  readonly id: string | null | undefined;
  readonly isStarred: boolean | null | undefined;
  readonly " $fragmentType": "StarClipButton_clip";
};
export type StarClipButton_clip$key = {
  readonly " $data"?: StarClipButton_clip$data;
  readonly " $fragmentSpreads": FragmentRefs<"StarClipButton_clip">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StarClipButton_clip",
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
      "name": "isStarred",
      "storageKey": null
    }
  ],
  "type": "Clip",
  "abstractKey": null
};

(node as any).hash = "46018f5be814d20021415d7435e04f49";

export default node;
