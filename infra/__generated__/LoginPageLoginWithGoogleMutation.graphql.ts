/**
 * @generated SignedSource<<4a8309a1e511b4f0cfd3bfccdf764137>>
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
    readonly actor: {
      readonly id: string;
      readonly name?: string | null | undefined;
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
    "cacheID": "768c5d3e1cda273978a95863c379aeb8",
    "id": null,
    "metadata": {},
    "name": "LoginPageLoginWithGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation LoginPageLoginWithGoogleMutation(\n  $credential: String!\n) {\n  loginWithGoogle(credential: $credential) {\n    actor {\n      __typename\n      id\n      ... on BfPerson {\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "34d03411756e29acffde74720737ce45";

export default node;
