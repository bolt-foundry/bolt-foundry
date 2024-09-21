/**
 * @generated SignedSource<<0a15c2179f857398fc2e17ae1e98bf99>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ClipSearchSidebar_savedSearchConnection$data = {
  readonly count: number | null | undefined;
  readonly edges: ReadonlyArray<{
    readonly node: {
      readonly id: string;
      readonly query: string | null | undefined;
    } | null | undefined;
  } | null | undefined> | null | undefined;
  readonly pageInfo: {
    readonly endCursor: string | null | undefined;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
    readonly startCursor: string | null | undefined;
  };
  readonly " $fragmentType": "ClipSearchSidebar_savedSearchConnection";
};
export type ClipSearchSidebar_savedSearchConnection$key = {
  readonly " $data"?: ClipSearchSidebar_savedSearchConnection$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipSearchSidebar_savedSearchConnection">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ClipSearchSidebar_savedSearchConnection",
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
      "concreteType": "BfSavedSearchEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BfSavedSearch",
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
              "name": "query",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PageInfo",
      "kind": "LinkedField",
      "name": "pageInfo",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startCursor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endCursor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hasNextPage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hasPreviousPage",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BfSavedSearchConnection",
  "abstractKey": null
};

(node as any).hash = "0c74389cbd571bca9f19651ebc8ffeef";

export default node;
