/**
 * @generated SignedSource<<019945e13e4ad89c9fad132714418bb1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import * as __ClipEditModalRefetchQuery_graphql from "packages/__generated__/./ClipEditModalRefetchQuery.graphql.ts";
import { FragmentRefs } from "relay-runtime";
export type ClipEditModal_bfSavedSearchResult$data = {
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
  readonly " $fragmentType": "ClipEditModal_bfSavedSearchResult";
};
export type ClipEditModal_bfSavedSearchResult$key = {
  readonly " $data"?: ClipEditModal_bfSavedSearchResult$data;
  readonly " $fragmentSpreads": FragmentRefs<"ClipEditModal_bfSavedSearchResult">;
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
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "endTime"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "startTime"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": __ClipEditModalRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
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
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "endTime",
          "variableName": "endTime"
        },
        {
          "kind": "Variable",
          "name": "startTime",
          "variableName": "startTime"
        }
      ],
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
        (v1/*: any*/),
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
  "type": "BfSavedSearchResult",
  "abstractKey": null
};
})();

(node as any).hash = "3ff84d0ebc06cc87381f92f23c415e42";

export default node;
