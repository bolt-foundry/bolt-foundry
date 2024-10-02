/**
 * @generated SignedSource<<e2a10e5d15011ffc896313a265f76761>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GoogleFilePickerQuery$variables = Record<PropertyKey, never>;
export type GoogleFilePickerQuery$data = {
  readonly currentViewer: {
    readonly person: {
      readonly googleAuthAccessToken: string | null | undefined;
      readonly name: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type GoogleFilePickerQuery = {
  response: GoogleFilePickerQuery$data;
  variables: GoogleFilePickerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "googleAuthAccessToken",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleFilePickerQuery",
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
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "GoogleFilePickerQuery",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "26ea21dbb789ee600ecceab583c616e3",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerQuery",
    "operationKind": "query",
    "text": "query GoogleFilePickerQuery {\n  currentViewer {\n    __typename\n    person {\n      name\n      googleAuthAccessToken\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2223bc879170f46de3685ec17cd752f8";

export default node;
