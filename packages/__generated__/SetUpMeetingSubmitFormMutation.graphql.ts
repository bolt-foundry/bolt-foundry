/**
 * @generated SignedSource<<192bf2e1245efca0215cb9bd0968e528>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SubmitContactFormInput = {
  company?: string | null | undefined;
  email: string;
  message: string;
  name: string;
  phone?: string | null | undefined;
};
export type SetUpMeetingSubmitFormMutation$variables = {
  input: SubmitContactFormInput;
};
export type SetUpMeetingSubmitFormMutation$data = {
  readonly submitContactForm: {
    readonly message: string | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type SetUpMeetingSubmitFormMutation = {
  response: SetUpMeetingSubmitFormMutation$data;
  variables: SetUpMeetingSubmitFormMutation$variables;
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
    "concreteType": "SubmitContactFormPayload",
    "kind": "LinkedField",
    "name": "submitContactForm",
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
    "name": "SetUpMeetingSubmitFormMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetUpMeetingSubmitFormMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9b5c91059cea69565a0f70d54cdbe95b",
    "id": null,
    "metadata": {},
    "name": "SetUpMeetingSubmitFormMutation",
    "operationKind": "mutation",
    "text": "mutation SetUpMeetingSubmitFormMutation(\n  $input: SubmitContactFormInput!\n) {\n  submitContactForm(input: $input) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "1690e038b9ae538295b57f0b45a7d3f7";

export default node;
