/**
 * @generated SignedSource<<54c7fa6458634461e7df71420783ce7a>>
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
export type ContactUsSubmitFormMutation$variables = {
  input: SubmitContactFormInput;
};
export type ContactUsSubmitFormMutation$data = {
  readonly submitContactForm: {
    readonly message: string | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type ContactUsSubmitFormMutation = {
  response: ContactUsSubmitFormMutation$data;
  variables: ContactUsSubmitFormMutation$variables;
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
    "name": "ContactUsSubmitFormMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ContactUsSubmitFormMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c505624ced09d67893bb8846796b4310",
    "id": null,
    "metadata": {},
    "name": "ContactUsSubmitFormMutation",
    "operationKind": "mutation",
    "text": "mutation ContactUsSubmitFormMutation(\n  $input: SubmitContactFormInput!\n) {\n  submitContactForm(input: $input) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "eed8fcce47969bc3df0739d5f531cf55";

export default node;
