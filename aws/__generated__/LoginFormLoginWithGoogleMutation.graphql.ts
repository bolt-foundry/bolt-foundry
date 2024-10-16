/**
 * @generated SignedSource<<b4ec838055b6dad9599488c692d6ee6d>>
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
    readonly actor: {
      readonly id: string;
      readonly name?: string | null | undefined;
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
    "kind": "Variable",
    "name": "credential",
    "variableName": "credential"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "BfPerson",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginFormLoginWithGoogleMutation",
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
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
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
    "name": "LoginFormLoginWithGoogleMutation",
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
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "77ca2a8834597ba4469926226c2c30b9",
    "id": null,
    "metadata": {},
    "name": "LoginFormLoginWithGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormLoginWithGoogleMutation(\n  $credential: String!\n) {\n  loginWithGoogle(credential: $credential) {\n    actor {\n      __typename\n      id\n      ... on BfPerson {\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "86e881b4514c4d4fae033297d6d3b59c";

export default node;
