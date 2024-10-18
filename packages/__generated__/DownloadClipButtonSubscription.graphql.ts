/**
 * @generated SignedSource<<3e50a6bda5a83132456649ae847a6122>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadClipButtonSubscription$variables = {
  id: string;
};
export type DownloadClipButtonSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"DownloadClipButton_bfSavedSearchResult">;
  } | null | undefined;
};
export type DownloadClipButtonSubscription = {
  response: DownloadClipButtonSubscription$data;
  variables: DownloadClipButtonSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startTime",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endTime",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "percentageRendered",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadClipButtonSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "DownloadClipButton_bfSavedSearchResult"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DownloadClipButtonSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
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
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "title",
                "storageKey": null
              },
              (v4/*: any*/),
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
                  (v4/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "BfSavedSearchResult",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e244c77cd747e98d7504f891fccac245",
    "id": null,
    "metadata": {},
    "name": "DownloadClipButtonSubscription",
    "operationKind": "subscription",
    "text": "subscription DownloadClipButtonSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...DownloadClipButton_bfSavedSearchResult\n    id\n  }\n}\n\nfragment DownloadClipButton_bfSavedSearchResult on BfSavedSearchResult {\n  id\n  startTime\n  endTime\n  title\n  percentageRendered\n  downloadable {\n    url\n    percentageRendered\n    ready\n  }\n  words {\n    text\n    startTime\n    endTime\n  }\n}\n"
  }
};
})();

(node as any).hash = "f90fd17a42ea281c0b0dbf28fa8c7643";

export default node;
