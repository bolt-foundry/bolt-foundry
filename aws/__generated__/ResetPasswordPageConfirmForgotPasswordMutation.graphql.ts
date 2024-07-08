/**
 * @generated SignedSource<<616dda1beb9a0a58b6a4eb5e41a15bd6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ResetPasswordPageConfirmForgotPasswordMutation$variables = {
  email: string;
  newPassword: string;
  verificationCode: string;
};
export type ResetPasswordPageConfirmForgotPasswordMutation$data = {
  readonly confirmForgotPassword: {
    readonly id: string | null | undefined;
  } | null | undefined;
};
export type ResetPasswordPageConfirmForgotPasswordMutation = {
  response: ResetPasswordPageConfirmForgotPasswordMutation$data;
  variables: ResetPasswordPageConfirmForgotPasswordMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "newPassword"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "verificationCode"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "newPassword",
        "variableName": "newPassword"
      },
      {
        "kind": "Variable",
        "name": "verificationCode",
        "variableName": "verificationCode"
      }
    ],
    "concreteType": "Person",
    "kind": "LinkedField",
    "name": "confirmForgotPassword",
    "plural": false,
    "selections": [
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
    "name": "ResetPasswordPageConfirmForgotPasswordMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ResetPasswordPageConfirmForgotPasswordMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "ddb13058f61316f94b408c3bb0d0eec1",
    "id": null,
    "metadata": {},
    "name": "ResetPasswordPageConfirmForgotPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation ResetPasswordPageConfirmForgotPasswordMutation(\n  $email: String!\n  $verificationCode: String!\n  $newPassword: String!\n) {\n  confirmForgotPassword(email: $email, verificationCode: $verificationCode, newPassword: $newPassword) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d7cd1af0409f9ebfc4bb955f5a92622b";

export default node;
