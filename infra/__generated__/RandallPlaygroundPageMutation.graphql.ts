/**
 * @generated SignedSource<<9059cb0008db9d7ae2ac21e0d7b197fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RandallPlaygroundPageMutation$variables = {
  file: any;
  originalClipId: string;
  title: string;
};
export type RandallPlaygroundPageMutation$data = {
  readonly upsertClip: {
    readonly title: string | null | undefined;
  } | null | undefined;
};
export type RandallPlaygroundPageMutation = {
  response: RandallPlaygroundPageMutation$data;
  variables: RandallPlaygroundPageMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "file"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "originalClipId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v3 = [
  {
    "kind": "Variable",
    "name": "file",
    "variableName": "file"
  },
  {
    "kind": "Variable",
    "name": "originalClipId",
    "variableName": "originalClipId"
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RandallPlaygroundPageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "BfClip",
        "kind": "LinkedField",
        "name": "upsertClip",
        "plural": false,
        "selections": [
          (v4/*: any*/)
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "RandallPlaygroundPageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "BfClip",
        "kind": "LinkedField",
        "name": "upsertClip",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
    "cacheID": "67309b111a252996576f288a169744ba",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPageMutation",
    "operationKind": "mutation",
    "text": "mutation RandallPlaygroundPageMutation(\n  $file: File!\n  $title: String!\n  $originalClipId: String!\n) {\n  upsertClip(file: $file, title: $title, originalClipId: $originalClipId) {\n    title\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "67cf5701a51151c08db0cf6000034044";

export default node;
