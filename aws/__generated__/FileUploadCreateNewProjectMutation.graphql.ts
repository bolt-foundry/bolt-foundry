/**
 * @generated SignedSource<<e41aaa0accca5cad53a420eadf1d2797>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type FileUploadCreateNewProjectMutation$variables = {
  connections: ReadonlyArray<string>;
  height: number;
  language: string;
  model: string;
  name: string;
  usesOriginPrivateFileSystem: boolean;
  width: number;
};
export type FileUploadCreateNewProjectMutation$data = {
  readonly createProject: {
    readonly node: {
      readonly id: string | null | undefined;
      readonly trackUploadUrl: string | null | undefined;
      readonly url: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type FileUploadCreateNewProjectMutation = {
  response: FileUploadCreateNewProjectMutation$data;
  variables: FileUploadCreateNewProjectMutation$variables;
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
  "name": "height"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "language"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "model"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "usesOriginPrivateFileSystem"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "width"
},
v7 = [
  {
    "kind": "Variable",
    "name": "height",
    "variableName": "height"
  },
  {
    "kind": "Variable",
    "name": "language",
    "variableName": "language"
  },
  {
    "kind": "Variable",
    "name": "model",
    "variableName": "model"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "usesOriginPrivateFileSystem",
    "variableName": "usesOriginPrivateFileSystem"
  },
  {
    "kind": "Variable",
    "name": "width",
    "variableName": "width"
  }
],
v8 = {
  "alias": null,
  "args": (v7/*: any*/),
  "concreteType": "ProjectEdge",
  "kind": "LinkedField",
  "name": "createProject",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Project",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "trackUploadUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        },
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
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "FileUploadCreateNewProjectMutation",
    "selections": [
      (v8/*: any*/)
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v1/*: any*/),
      (v6/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "FileUploadCreateNewProjectMutation",
    "selections": [
      (v8/*: any*/),
      {
        "alias": null,
        "args": (v7/*: any*/),
        "filters": null,
        "handle": "appendEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createProject",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "7a9cc3e02e6cb608a302415d7f8f444c",
    "id": null,
    "metadata": {},
    "name": "FileUploadCreateNewProjectMutation",
    "operationKind": "mutation",
    "text": "mutation FileUploadCreateNewProjectMutation(\n  $name: String!\n  $height: Int!\n  $width: Int!\n  $language: String!\n  $model: String!\n  $usesOriginPrivateFileSystem: Boolean!\n) {\n  createProject(name: $name, height: $height, width: $width, language: $language, model: $model, usesOriginPrivateFileSystem: $usesOriginPrivateFileSystem) {\n    node {\n      trackUploadUrl\n      url\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "16a36649d9b2805ec493657876526f68";

export default node;
