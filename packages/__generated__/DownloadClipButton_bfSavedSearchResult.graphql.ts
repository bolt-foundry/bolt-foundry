/**
 * @generated SignedSource<<edd439c9c9cf95d5ae826cac2859b9fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadClipButton_bfSavedSearchResult$data = {
  readonly downloadable: {
    readonly percentageRendered: number | null | undefined;
    readonly ready: boolean | null | undefined;
    readonly url: any | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "DownloadClipButton_bfSavedSearchResult";
};
export type DownloadClipButton_bfSavedSearchResult$key = {
  readonly " $data"?: DownloadClipButton_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"DownloadClipButton_bfSavedSearchResult">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DownloadClipButton_bfSavedSearchResult",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "VideoDownloadable",
      "kind": "LinkedField",
      "name": "downloadable",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "percentageRendered",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "ready",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};

(node as any).hash = "a67d89de55ea9ca597ba5a426caf4012";

export default node;
