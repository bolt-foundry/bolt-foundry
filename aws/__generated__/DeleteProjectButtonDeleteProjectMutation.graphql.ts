/**
 * @generated SignedSource<<cde533e35e068430879a7da93f7a7bfc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteProjectButtonDeleteProjectMutation$variables = {
  connections: ReadonlyArray<string>;
  id: string;
};
export type DeleteProjectButtonDeleteProjectMutation$data = {
  readonly deleteProject: {
    readonly id: string | null | undefined;
  } | null | undefined;
};
export type DeleteProjectButtonDeleteProjectMutation = {
  response: DeleteProjectButtonDeleteProjectMutation$data;
  variables: DeleteProjectButtonDeleteProjectMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteProjectButtonDeleteProjectMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "deleteProject",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "DeleteProjectButtonDeleteProjectMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "deleteProject",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "id",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "db43dc7817ac41f844f3673eaa4b25f1",
    "id": null,
    "metadata": {},
    "name": "DeleteProjectButtonDeleteProjectMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteProjectButtonDeleteProjectMutation(\n  $id: ID!\n) {\n  deleteProject(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d00b3781eb6425d5a8545411ec11a95b";

export default node;
