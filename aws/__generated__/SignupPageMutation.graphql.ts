/**
 * @generated SignedSource<<db441821b07bbc7949c85eeff6582111>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SignupPageMutation$variables = {
  email: string;
  intendedSubscriptionTier: string;
  name: string;
  password: string;
};
export type SignupPageMutation$data = {
  readonly signup: {
    readonly id: string | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type SignupPageMutation = {
  response: SignupPageMutation$data;
  variables: SignupPageMutation$variables;
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
  "name": "intendedSubscriptionTier"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v4 = [
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
        "name": "intendedSubscriptionTier",
        "variableName": "intendedSubscriptionTier"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      }
    ],
    "concreteType": "Person",
    "kind": "LinkedField",
    "name": "signup",
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SignupPageMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "SignupPageMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "4f96f52f28ad09b0cb40f6e25da36c39",
    "id": null,
    "metadata": {},
    "name": "SignupPageMutation",
    "operationKind": "mutation",
    "text": "mutation SignupPageMutation(\n  $name: String!\n  $email: String!\n  $password: String!\n  $intendedSubscriptionTier: String!\n) {\n  signup(name: $name, email: $email, password: $password, intendedSubscriptionTier: $intendedSubscriptionTier) {\n    id\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "8dcb296cc894f698e9557b9d0f575f4f";

export default node;
