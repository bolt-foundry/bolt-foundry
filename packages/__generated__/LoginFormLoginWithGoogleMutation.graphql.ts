/**
 * @generated SignedSource<<5e0dabb5c700858055b4cacaed571f74>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoginFormLoginWithGoogleMutation$variables = {
  credential: string;
};
export type LoginFormLoginWithGoogleMutation$data = {
  readonly loginWithGoogle: {
    readonly person: {
      readonly id: string;
      readonly name: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type LoginFormLoginWithGoogleMutation = {
  response: LoginFormLoginWithGoogleMutation$data;
  variables: LoginFormLoginWithGoogleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "credential"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "credential",
        "variableName": "credential"
      }
    ],
    "concreteType": "BfCurrentViewerAccessToken",
    "kind": "LinkedField",
    "name": "loginWithGoogle",
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
            "name": "name",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginFormLoginWithGoogleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoginFormLoginWithGoogleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b2d3af35a767d9b7d237ce623ecd19c5",
    "id": null,
    "metadata": {},
    "name": "LoginFormLoginWithGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormLoginWithGoogleMutation(\n  $credential: String!\n) {\n  loginWithGoogle(credential: $credential) {\n    person {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cb92f652f4f517f96918b95f68833af3";

export default node;
