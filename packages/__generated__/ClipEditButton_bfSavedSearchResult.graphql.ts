/**
 * @generated SignedSource<<cacefbb43c8a04b8e9212b97a95a4a1c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipEditButton_bfSavedSearchResult$data = {
  readonly description: string | null | undefined;
  readonly endTime: any | null | undefined;
  readonly id: string;
  readonly startTime: any | null | undefined;
  readonly title: string | null | undefined;
  readonly words: ReadonlyArray<{
    readonly endTime: any | null | undefined;
    readonly speaker: string | null | undefined;
    readonly startTime: any | null | undefined;
    readonly text: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditModal_bfSavedSearchResult">;
  readonly " $fragmentType": "ClipEditButton_bfSavedSearchResult";
};
export type ClipEditButton_bfSavedSearchResult$key = {
  readonly " $data"?: ClipEditButton_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditButton_bfSavedSearchResult">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startTime",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endTime",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipEditButton_bfSavedSearchResult",
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
      "name": "title",
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Word",
      "kind": "LinkedField",
      "name": "words",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "text",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "speaker",
          "storageKey": null
        },
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClipEditModal_bfSavedSearchResult"
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};
})();

(node as any).hash = "454fa92aaaca3da3628e38583d072c2c";

export default node;
