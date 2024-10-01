/**
 * @generated SignedSource<<5ed1e82faf1690c691ac192b3dcc9c34>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResult_bfSavedSearchResult$data = {
  readonly body: string | null | undefined;
  readonly confidence: number | null | undefined;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly rationale: string | null | undefined;
  readonly title: string | null | undefined;
  readonly topics: string | null | undefined;
  readonly " $fragmentType": "SearchResult_bfSavedSearchResult";
};
export type SearchResult_bfSavedSearchResult$key = {
  readonly " $data"?: SearchResult_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchResult_bfSavedSearchResult">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchResult_bfSavedSearchResult",
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
      "args": null,
      "kind": "ScalarField",
      "name": "body",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rationale",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "confidence",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "topics",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};

(node as any).hash = "3369eb7b798fb99885a94b10e9dde620";

export default node;
