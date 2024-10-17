/**
 * @generated SignedSource<<ddf0bd933850126951565fca91a3d98c>>
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
  readonly endTime: any | null | undefined;
  readonly id: string;
  readonly startTime: any | null | undefined;
  readonly title: string | null | undefined;
  readonly words: ReadonlyArray<{
    readonly endTime: any | null | undefined;
    readonly startTime: any | null | undefined;
    readonly text: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "DownloadClipButton_bfSavedSearchResult";
};
export type DownloadClipButton_bfSavedSearchResult$key = {
  readonly " $data"?: DownloadClipButton_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"DownloadClipButton_bfSavedSearchResult">;
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
  "name": "DownloadClipButton_bfSavedSearchResult",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
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
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "BfSavedSearchResult",
  "abstractKey": null
};
})();

(node as any).hash = "ecb4ad37268b76e56a96a75249ccab5d";

export default node;
