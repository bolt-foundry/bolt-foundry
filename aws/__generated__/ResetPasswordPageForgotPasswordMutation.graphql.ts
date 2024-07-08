/**
 * @generated SignedSource<<f561b831c1f3d7052508af8b71d7a692>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ResetPasswordPageForgotPasswordMutation$variables = {
  email: string;
};
export type ResetPasswordPageForgotPasswordMutation$data = {
  readonly forgotPassword: boolean | null | undefined;
};
export type ResetPasswordPageForgotPasswordMutation = {
  response: ResetPasswordPageForgotPasswordMutation$data;
  variables: ResetPasswordPageForgotPasswordMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      }
    ],
    "kind": "ScalarField",
    "name": "forgotPassword",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ResetPasswordPageForgotPasswordMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResetPasswordPageForgotPasswordMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e78f9a65e1602a7b7d91d6133ed1f773",
    "id": null,
    "metadata": {},
    "name": "ResetPasswordPageForgotPasswordMutation",
    "operationKind": "mutation",
    "text": "mutation ResetPasswordPageForgotPasswordMutation(\n  $email: String!\n) {\n  forgotPassword(email: $email)\n}\n"
  }
};
})();

(node as any).hash = "9769b2a3a3d3fc42369a50dcd7756400";

export default node;
