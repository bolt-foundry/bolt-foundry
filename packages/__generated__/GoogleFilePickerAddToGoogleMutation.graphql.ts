/**
 * @generated SignedSource<<116ae8fb7d679d406a7e625ab13b8859>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GoogleFilePickerAddToGoogleMutation$variables = {
  code: string;
};
export type GoogleFilePickerAddToGoogleMutation$data = {
  readonly linkAdvancedGoogleAuth: {
    readonly person: {
      readonly googleAuthAccessToken: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type GoogleFilePickerAddToGoogleMutation = {
  response: GoogleFilePickerAddToGoogleMutation$data;
  variables: GoogleFilePickerAddToGoogleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "code"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "code",
    "variableName": "code"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "googleAuthAccessToken",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleFilePickerAddToGoogleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "linkAdvancedGoogleAuth",
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
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GoogleFilePickerAddToGoogleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "linkAdvancedGoogleAuth",
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
            "kind": "TypeDiscriminator",
            "abstractKey": "__isBfCurrentViewer"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
            "plural": false,
            "selections": [
              (v2/*: any*/),
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
    "cacheID": "30c08cbe08ce57cedaf2a0ff1d08e21c",
    "id": null,
    "metadata": {},
    "name": "GoogleFilePickerAddToGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleFilePickerAddToGoogleMutation(\n  $code: String!\n) {\n  linkAdvancedGoogleAuth(code: $code) {\n    __typename\n    __isBfCurrentViewer: __typename\n    person {\n      googleAuthAccessToken\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "84088030890a5547dd9674f79549166e";

export default node;
