/**
 * @generated SignedSource<<63397775c6b2770c19b84dd3fc1947f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ContactFormSubmissionInput = {
  company?: string | null | undefined;
  email: string;
  message: string;
  name: string;
  phone?: string | null | undefined;
};
export type ContactUsMutation$variables = {
  input: ContactFormSubmissionInput;
};
export type ContactUsMutation$data = {
  readonly createContactFormSubmission: {
    readonly email: string | null | undefined;
  } | null | undefined;
};
export type ContactUsMutation = {
  response: ContactUsMutation$data;
  variables: ContactUsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
      }
    ],
    "concreteType": "ContactFormSubmission",
    "kind": "LinkedField",
    "name": "createContactFormSubmission",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
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
    "name": "ContactUsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ContactUsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "07cc8cd942bbea6fe55fdf932640c013",
    "id": null,
    "metadata": {},
    "name": "ContactUsMutation",
    "operationKind": "mutation",
    "text": "mutation ContactUsMutation(\n  $input: ContactFormSubmissionInput!\n) {\n  createContactFormSubmission(input: $input) {\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "edd171009539f0645b2a65fa3b8da485";

export default node;
