/**
 * @generated SignedSource<<0139c5c3f92879ab1b6d8fb228ddbaea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GoogleDriveFilePickerQuery$variables = Record<PropertyKey, never>;
export type GoogleDriveFilePickerQuery$data = {
  readonly currentViewer: {
    readonly googleAccessToken: string | null | undefined;
  } | null | undefined;
};
export type GoogleDriveFilePickerQuery = {
  response: GoogleDriveFilePickerQuery$data;
  variables: GoogleDriveFilePickerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "googleAccessToken",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleDriveFilePickerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GoogleDriveFilePickerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0f0b9f890b0163ead5b3be2a2504bb37",
    "id": null,
    "metadata": {},
    "name": "GoogleDriveFilePickerQuery",
    "operationKind": "query",
    "text": "query GoogleDriveFilePickerQuery {\n  currentViewer {\n    __typename\n    googleAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d8fce329c24ec777f4ce834939ea5c0";

export default node;
