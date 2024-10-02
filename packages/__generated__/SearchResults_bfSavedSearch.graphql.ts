/**
 * @generated SignedSource<<c5bb8b1021476405f570a388eddab247>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResults_bfSavedSearch$data = {
  readonly id: string;
  readonly query: string | null | undefined;
  readonly searchResults: {
    readonly count: number | null | undefined;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly body: string | null | undefined;
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"SearchResult_bfSavedSearchResult">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "SearchResults_bfSavedSearch";
};
export type SearchResults_bfSavedSearch$key = {
  readonly " $data"?: SearchResults_bfSavedSearch$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchResults_bfSavedSearch">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
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
    (v0/*: any*/),
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
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "body",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "SearchResult_bfSavedSearchResult"
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
})();

(node as any).hash = "49687764d63a00fdd70fed6b65796875";

export default node;
