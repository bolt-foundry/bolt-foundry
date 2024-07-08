/**
 * @generated SignedSource<<e24324a7bafe351070109d1d0534a726>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ProjectTitleMutation$variables = {
  id: string;
  name: string;
};
export type ProjectTitleMutation$data = {
  readonly updateProject: {
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type ProjectTitleMutation = {
  response: ProjectTitleMutation$data;
  variables: ProjectTitleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProjectTitleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "updateProject",
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
    "name": "ProjectTitleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "updateProject",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "abf9d6ca2df3625a1e33c1bb66cf23ad",
    "id": null,
    "metadata": {},
    "name": "ProjectTitleMutation",
    "operationKind": "mutation",
    "text": "mutation ProjectTitleMutation(\n  $id: ID!\n  $name: String!\n) {\n  updateProject(id: $id, name: $name) {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "b94bff0820e86c8db8ecfce734987cc9";

export default node;
