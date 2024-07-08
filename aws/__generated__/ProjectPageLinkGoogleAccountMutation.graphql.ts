/**
 * @generated SignedSource<<1bf42d62dd7232c9eabc81b7f00ed737>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ProjectPageLinkGoogleAccountMutation$variables = {
  code: string;
};
export type ProjectPageLinkGoogleAccountMutation$data = {
  readonly linkGoogleAccount: {
    readonly googleAccessToken: string | null | undefined;
  } | null | undefined;
};
export type ProjectPageLinkGoogleAccountMutation = {
  response: ProjectPageLinkGoogleAccountMutation$data;
  variables: ProjectPageLinkGoogleAccountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "code"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "code",
    "variableName": "code"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "googleAccessToken",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectPageLinkGoogleAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "linkGoogleAccount",
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
    "name": "ProjectPageLinkGoogleAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "linkGoogleAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9f3cd0c1c743d54358b27217149e8253",
    "id": null,
    "metadata": {},
    "name": "ProjectPageLinkGoogleAccountMutation",
    "operationKind": "mutation",
    "text": "mutation ProjectPageLinkGoogleAccountMutation(\n  $code: String!\n) {\n  linkGoogleAccount(code: $code) {\n    __typename\n    googleAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "fbf18bc1c7dc2607bc62e9ec4b42527d";

export default node;
