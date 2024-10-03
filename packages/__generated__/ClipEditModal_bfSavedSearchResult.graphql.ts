/**
 * @generated SignedSource<<e2d64c542b488539d46e0eebfc9a9221>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipEditModal_bfSavedSearchResult$data = {
  readonly id: string;
  readonly title: string | null | undefined;
  readonly words: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly end: any | null | undefined;
        readonly punctuated_word: string | null | undefined;
        readonly speaker: string | null | undefined;
        readonly start: any | null | undefined;
        readonly word: string | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "ClipEditModal_bfSavedSearchResult";
};
export type ClipEditModal_bfSavedSearchResult$key = {
  readonly " $data"?: ClipEditModal_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditModal_bfSavedSearchResult">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipEditModal_bfSavedSearchResult",
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
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "BfFakeClipDataConnection",
      "kind": "LinkedField",
      "name": "words",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BfFakeClipDataEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BfFakeClipData",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "word",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "start",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "end",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "punctuated_word",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "speaker",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "words(first:10)"
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};

(node as any).hash = "e27914522a6bb62195fc1afb4bc6999f";

export default node;
