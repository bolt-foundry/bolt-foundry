/**
 * @generated SignedSource<<53b54c0461982f6318d666efe64fb568>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchSearchResultList_bfSearchResultConnection$data = {
  readonly count: number | null | undefined;
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly __typename: "BfSearchResult";
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"ClipSearchResultListItem_bfSearchResult">;
    } | null | undefined;
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "ClipSearchSearchResultList_bfSearchResultConnection";
};
export type ClipSearchSearchResultList_bfSearchResultConnection$key = {
  readonly " $data"?: ClipSearchSearchResultList_bfSearchResultConnection$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipSearchSearchResultList_bfSearchResultConnection">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipSearchSearchResultList_bfSearchResultConnection",
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
      "concreteType": "BfSearchResultEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BfSearchResult",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__typename",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "ClipSearchResultListItem_bfSearchResult"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BfSearchResultConnection",
  "abstractKey": null
};

(node as any).hash = "529bb4c925483e598816146b6ce5adb0";

export default node;
