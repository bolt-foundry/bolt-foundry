/**
 * @generated SignedSource<<6379fbbe9fea3028db18a8a20ebd6c67>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoginFormLoginMutation$variables = {
  email: string;
  password: string;
};
export type LoginFormLoginMutation$data = {
  readonly login: {
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type LoginFormLoginMutation = {
  response: LoginFormLoginMutation$data;
  variables: LoginFormLoginMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "password"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "password",
    "variableName": "password"
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
    "name": "LoginFormLoginMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "login",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "LoginFormLoginMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Person",
        "kind": "LinkedField",
        "name": "login",
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
    ]
  },
  "params": {
    "cacheID": "7d710474cafad2b6faaa934243902c43",
    "id": null,
    "metadata": {},
    "name": "LoginFormLoginMutation",
    "operationKind": "mutation",
    "text": "mutation LoginFormLoginMutation(\n  $email: String!\n  $password: String!\n) {\n  login(email: $email, password: $password) {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "1bc2b99bc708cd98621cd50259100715";

export default node;
