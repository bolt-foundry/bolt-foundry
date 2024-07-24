/**
 * @generated SignedSource<<846a4fc8f388546208610c1f4317b364>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoginPageLoginWithGoogleMutation$variables = {
  credential: string;
};
export type LoginPageLoginWithGoogleMutation$data = {
  readonly loginWithGoogle: {
    readonly person: {
      readonly name: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type LoginPageLoginWithGoogleMutation = {
  response: LoginPageLoginWithGoogleMutation$data;
  variables: LoginPageLoginWithGoogleMutation$variables;
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
    "kind": "Variable",
    "name": "credential",
    "variableName": "credential"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginPageLoginWithGoogleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "name": "LoginPageLoginWithGoogleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "cacheID": "92796fd4b1e411736587eff45ba4692d",
    "id": null,
    "metadata": {},
    "name": "LoginPageLoginWithGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation LoginPageLoginWithGoogleMutation(\n  $credential: String!\n) {\n  loginWithGoogle(credential: $credential) {\n    person {\n      name\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e86f25843fea13e1e36be35c0de762f3";

export default node;
