/**
 * @generated SignedSource<<023f009131d0ff86b39517ca478bffe1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ConfirmEmailPageMutation$variables = {
  confirmationCode: string;
  email: string;
  password: string;
};
export type ConfirmEmailPageMutation$data = {
  readonly confirmEmail: {
    readonly id: string | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type ConfirmEmailPageMutation = {
  response: ConfirmEmailPageMutation$data;
  variables: ConfirmEmailPageMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "confirmationCode"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "confirmationCode",
        "variableName": "confirmationCode"
      },
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
    "concreteType": "Person",
    "kind": "LinkedField",
    "name": "confirmEmail",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ConfirmEmailPageMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ConfirmEmailPageMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "0d4ffc3648b23cf49a5edcb4c93e5acf",
    "id": null,
    "metadata": {},
    "name": "ConfirmEmailPageMutation",
    "operationKind": "mutation",
    "text": "mutation ConfirmEmailPageMutation(\n  $email: String!\n  $password: String!\n  $confirmationCode: String!\n) {\n  confirmEmail(email: $email, password: $password, confirmationCode: $confirmationCode) {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "378728764700e9a884a9a62167fc7e5d";

export default node;
