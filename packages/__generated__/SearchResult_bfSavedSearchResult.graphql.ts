/**
 * @generated SignedSource<<eb40ca1de1221c2f4a42bba1954b0498>>
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
  readonly endTime: any | null | undefined;
  readonly id: string;
  readonly rationale: string | null | undefined;
  readonly startTime: any | null | undefined;
  readonly title: string | null | undefined;
  readonly topics: ReadonlyArray<string | null | undefined> | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditButton_bfSavedSearchResult" | "DownloadClipButton_bfSavedSearchResult">;
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
      "name": "description",
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
      "name": "topics",
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
      "name": "startTime",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endTime",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClipEditButton_bfSavedSearchResult"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DownloadClipButton_bfSavedSearchResult"
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};

(node as any).hash = "dde91ebcb639219a582a0789ba44ae68";

export default node;
