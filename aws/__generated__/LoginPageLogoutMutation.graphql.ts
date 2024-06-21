/**
 * @generated SignedSource<<917d895cfb0c9856121e194dce47f778>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoginPageLogoutMutation$variables = Record<PropertyKey, never>;
export type LoginPageLogoutMutation$data = {
  readonly logout: {
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type LoginPageLogoutMutation = {
  response: LoginPageLogoutMutation$data;
  variables: LoginPageLogoutMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginPageLogoutMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "logout",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LoginPageLogoutMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "logout",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "dad7a81b51beb68c3da50c22dba44a62",
    "id": null,
    "metadata": {},
    "name": "LoginPageLogoutMutation",
    "operationKind": "mutation",
    "text": "mutation LoginPageLogoutMutation {\n  logout {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "ef7da02b80ffe2f36d9d4841d32c1276";

export default node;
