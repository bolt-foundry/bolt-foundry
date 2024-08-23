/**
 * @generated SignedSource<<cdaa1b1fe7323125e0ad2aed09bfce9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ClipSearchContextMutation$variables = {
  input: string;
  suggestedModel?: string | null | undefined;
};
export type ClipSearchContextMutation$data = {
  readonly searchMutation: {
    readonly message: string | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type ClipSearchContextMutation = {
  response: ClipSearchContextMutation$data;
  variables: ClipSearchContextMutation$variables;
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
    "name": "ClipSearchContextMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ClipSearchContextMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0fdebd2cc30db7a2501b03f3c50c3cf4",
    "id": null,
    "metadata": {},
    "name": "ClipSearchContextMutation",
    "operationKind": "mutation",
    "text": "mutation ClipSearchContextMutation(\n  $input: String!\n  $suggestedModel: String\n) {\n  searchMutation(input: $input, suggestedModel: $suggestedModel) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "178ddd41d6cff738a67f4bb68db7407c";

export default node;
