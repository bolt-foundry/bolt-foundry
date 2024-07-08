/**
 * @generated SignedSource<<022354a77d34cd4ee4715da55b1fd36b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ResendConfirmationLinkMutation$variables = {
  email: string;
};
export type ResendConfirmationLinkMutation$data = {
  readonly resendConfirmationCode: boolean | null | undefined;
};
export type ResendConfirmationLinkMutation = {
  response: ResendConfirmationLinkMutation$data;
  variables: ResendConfirmationLinkMutation$variables;
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
    "name": "resendConfirmationCode",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ResendConfirmationLinkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ResendConfirmationLinkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a1dc42e95d0cb1be300d058c52e88c51",
    "id": null,
    "metadata": {},
    "name": "ResendConfirmationLinkMutation",
    "operationKind": "mutation",
    "text": "mutation ResendConfirmationLinkMutation(\n  $email: String!\n) {\n  resendConfirmationCode(email: $email)\n}\n"
  }
};
})();

(node as any).hash = "9c58bc4177eb10bc7840fa5f838d06d7";

export default node;
