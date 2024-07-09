/**
 * @generated SignedSource<<87501dbf90357d8823be3d56eaf43fe6>>
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
    readonly __typename: string;
  } | null | undefined;
};
export type LoginPageLogoutMutation = {
  response: LoginPageLogoutMutation$data;
  variables: LoginPageLogoutMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "logout",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginPageLogoutMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LoginPageLogoutMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "f3968e1093dba2469c6a2c14cd6bcd8d",
    "id": null,
    "metadata": {},
    "name": "LoginPageLogoutMutation",
    "operationKind": "mutation",
    "text": "mutation LoginPageLogoutMutation {\n  logout {\n    __typename\n  }\n}\n"
  }
};
})();

(node as any).hash = "f661b7718bd93dd42a53b37eaf5a76a5";

export default node;
