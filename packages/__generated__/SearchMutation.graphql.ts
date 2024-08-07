/**
 * @generated SignedSource<<d574e7de2f47fd3cca2a6d95c1872df6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchMutation$variables = {
  input: string;
  suggestedModel?: string | null | undefined;
};
export type SearchMutation$data = {
  readonly searchMutation: {
    readonly message: string | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type SearchMutation = {
  response: SearchMutation$data;
  variables: SearchMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "suggestedModel"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      },
      {
        "kind": "Variable",
        "name": "suggestedModel",
        "variableName": "suggestedModel"
      }
    ],
    "concreteType": "SearchMutationPayload",
    "kind": "LinkedField",
    "name": "searchMutation",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "message",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SearchMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "246c5805a690abdf17cf860a22973e7d",
    "id": null,
    "metadata": {},
    "name": "SearchMutation",
    "operationKind": "mutation",
    "text": "mutation SearchMutation(\n  $input: String!\n  $suggestedModel: String\n) {\n  searchMutation(input: $input, suggestedModel: $suggestedModel) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "508a0f5c97376a6651b96c2153d16f3a";

export default node;
