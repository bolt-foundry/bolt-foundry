/**
 * @generated SignedSource<<b5375891421e156a3ac1110123baf895>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type EditWordMutation$variables = {
  id: string;
  punctuated_word: string;
  start: number;
  word: string;
};
export type EditWordMutation$data = {
  readonly updateTranscriptWord: {
    readonly id: string | null | undefined;
    readonly transcriptText: string | null | undefined;
    readonly words: string | null | undefined;
  } | null | undefined;
};
export type EditWordMutation = {
  response: EditWordMutation$data;
  variables: EditWordMutation$variables;
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
    "name": "punctuated_word"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "start"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "word"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "punctuated_word",
        "variableName": "punctuated_word"
      },
      {
        "kind": "Variable",
        "name": "start",
        "variableName": "start"
      },
      {
        "kind": "Variable",
        "name": "word",
        "variableName": "word"
      }
    ],
    "concreteType": "Transcript",
    "kind": "LinkedField",
    "name": "updateTranscriptWord",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "words",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "transcriptText",
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
    "name": "EditWordMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditWordMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d256897b31a581530a0772e635667eff",
    "id": null,
    "metadata": {},
    "name": "EditWordMutation",
    "operationKind": "mutation",
    "text": "mutation EditWordMutation(\n  $id: ID!\n  $punctuated_word: String!\n  $start: Float!\n  $word: String!\n) {\n  updateTranscriptWord(id: $id, punctuated_word: $punctuated_word, start: $start, word: $word) {\n    id\n    words\n    transcriptText\n  }\n}\n"
  }
};
})();

(node as any).hash = "3668e36bd90610598e0ef5ef3a4d5b76";

export default node;
