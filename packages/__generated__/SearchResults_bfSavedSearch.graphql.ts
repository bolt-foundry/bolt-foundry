/**
 * @generated SignedSource<<66c9466e18145725f43426282a395703>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResults_bfSavedSearch$data = {
  readonly query: string | null | undefined;
  readonly searchResults: {
    readonly count: number | null | undefined;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly body: string | null | undefined;
        readonly id: string;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "SearchResults_bfSavedSearch";
};
export type SearchResults_bfSavedSearch$key = {
  readonly " $data"?: SearchResults_bfSavedSearch$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchResults_bfSavedSearch">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchResults_bfSavedSearch",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "query",
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
      "concreteType": "BfSavedSearchResultConnection",
      "kind": "LinkedField",
      "name": "searchResults",
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
          "concreteType": "BfSavedSearchResultEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BfSavedSearchResult",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
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
                  "name": "body",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "searchResults(first:10)"
    }
  ],
  "type": "BfSavedSearch",
  "abstractKey": null
};

(node as any).hash = "f6421f578c4be8a0e8e6b306d3121802";

export default node;
