/**
 * @generated SignedSource<<448d29967cb2fc00a6f7d7d6b4790223>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateOrgModalMutation$variables = {
  domainName: string;
  name: string;
  youtubePlaylistUrl?: string | null | undefined;
};
export type CreateOrgModalMutation$data = {
  readonly createOrg: {
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type CreateOrgModalMutation = {
  response: CreateOrgModalMutation$data;
  variables: CreateOrgModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "domainName"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "youtubePlaylistUrl"
},
v3 = [
  {
    "kind": "Variable",
    "name": "domainName",
    "variableName": "domainName"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "youtubePlaylistUrl",
    "variableName": "youtubePlaylistUrl"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
    "name": "CreateOrgModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "BfOrganization",
        "kind": "LinkedField",
        "name": "createOrg",
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateOrgModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "BfOrganization",
        "kind": "LinkedField",
        "name": "createOrg",
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
    "cacheID": "a6e5ce4d65b37fbd3564078054b29c88",
    "id": null,
    "metadata": {},
    "name": "CreateOrgModalMutation",
    "operationKind": "mutation",
    "text": "mutation CreateOrgModalMutation(\n  $name: String!\n  $youtubePlaylistUrl: String\n  $domainName: String!\n) {\n  createOrg(name: $name, youtubePlaylistUrl: $youtubePlaylistUrl, domainName: $domainName) {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "36d989b194240359a22d10a46d780d8c";

export default node;
