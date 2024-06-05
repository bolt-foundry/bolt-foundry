/**
 * @generated SignedSource<<53403c2299eabc8cb648db86f5ff4d35>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GoogleDriveFilePickerLinkGoogleAccountMutation$variables = {
  code: string;
};
export type GoogleDriveFilePickerLinkGoogleAccountMutation$data = {
  readonly linkGoogleAccount: {
    readonly googleAccessToken: string | null | undefined;
  } | null | undefined;
};
export type GoogleDriveFilePickerLinkGoogleAccountMutation = {
  response: GoogleDriveFilePickerLinkGoogleAccountMutation$data;
  variables: GoogleDriveFilePickerLinkGoogleAccountMutation$variables;
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
    "name": "GoogleDriveFilePickerLinkGoogleAccountMutation",
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
    "name": "GoogleDriveFilePickerLinkGoogleAccountMutation",
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
    "cacheID": "2c6852c576877ad9fa1d83474615aea1",
    "id": null,
    "metadata": {},
    "name": "GoogleDriveFilePickerLinkGoogleAccountMutation",
    "operationKind": "mutation",
    "text": "mutation GoogleDriveFilePickerLinkGoogleAccountMutation(\n  $code: String!\n) {\n  linkGoogleAccount(code: $code) {\n    __typename\n    googleAccessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "490295e71855485f724a91c05999b90f";

export default node;
