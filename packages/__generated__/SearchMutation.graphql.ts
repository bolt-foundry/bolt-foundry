/**
 * @generated SignedSource<<6af5535606955c9069c82a471c7a727e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchMutation$variables = {
  documents?: string | null | undefined;
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
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "documents"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "suggestedModel"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "documents",
        "variableName": "documents"
      },
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchMutation",
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
    "name": "SearchMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "86ffec417ec2eb79ab314fe5b52ea788",
    "id": null,
    "metadata": {},
    "name": "SearchMutation",
    "operationKind": "mutation",
    "text": "mutation SearchMutation(\n  $input: String!\n  $suggestedModel: String\n  $documents: String\n) {\n  searchMutation(input: $input, suggestedModel: $suggestedModel, documents: $documents) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "e5eff07c521486400c1e354d73e1557f";

export default node;
