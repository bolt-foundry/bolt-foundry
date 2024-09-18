/**
 * @generated SignedSource<<59e015df8966b96125269185903de460>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BlogPagePostFragment$data = {
  readonly author: {
    readonly avatarUrl: string | null | undefined;
    readonly email: string | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
  readonly content: ReadonlyArray<{
    readonly RichText?: ReadonlyArray<{
      readonly annotations: {
        readonly bold: boolean | null | undefined;
        readonly code: boolean | null | undefined;
        readonly color: string | null | undefined;
        readonly italic: boolean | null | undefined;
        readonly strikethrough: boolean | null | undefined;
        readonly underlined: boolean | null | undefined;
      } | null | undefined;
      readonly text: {
        readonly content: string | null | undefined;
        readonly link: {
          readonly url: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
    readonly caption?: ReadonlyArray<{
      readonly annotations: {
        readonly bold: boolean | null | undefined;
        readonly code: boolean | null | undefined;
        readonly color: string | null | undefined;
        readonly italic: boolean | null | undefined;
        readonly strikethrough: boolean | null | undefined;
        readonly underlined: boolean | null | undefined;
      } | null | undefined;
      readonly text: {
        readonly content: string | null | undefined;
        readonly link: {
          readonly url: string | null | undefined;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
    readonly color?: string | null | undefined;
    readonly icon?: string | null | undefined;
    readonly id?: string | null | undefined;
    readonly imgUrl?: string | null | undefined;
    readonly language?: string | null | undefined;
    readonly type?: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly coverUrl: string | null | undefined;
  readonly date: string | null | undefined;
  readonly icon: string | null | undefined;
  readonly id: string;
  readonly slug: string | null | undefined;
  readonly status: string | null | undefined;
  readonly summary: string | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "BlogPagePostFragment";
};
export type BlogPagePostFragment$key = {
  readonly " $data"?: BlogPagePostFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BlogPagePostFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "icon",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Text",
    "kind": "LinkedField",
    "name": "text",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "content",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Link",
        "kind": "LinkedField",
        "name": "link",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "url",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Annotations",
    "kind": "LinkedField",
    "name": "annotations",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "bold",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "code",
        "storageKey": null
      },
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "italic",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "strikethrough",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "underlined",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "RichText",
  "kind": "LinkedField",
  "name": "RichText",
  "plural": true,
  "selections": (v4/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BlogPagePostFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "date",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "summary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "BlogPostAuthor",
      "kind": "LinkedField",
      "name": "author",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "avatarUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "coverUrl",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "content",
      "plural": true,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/),
            (v5/*: any*/)
          ],
          "type": "ParagraphBlock",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "imgUrl",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "RichText",
              "kind": "LinkedField",
              "name": "caption",
              "plural": true,
              "selections": (v4/*: any*/),
              "storageKey": null
            }
          ],
          "type": "ImageBlock",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/),
            (v1/*: any*/),
            (v5/*: any*/)
          ],
          "type": "CalloutBlock",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "language",
              "storageKey": null
            },
            (v5/*: any*/)
          ],
          "type": "CodeBlock",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BlogPost",
  "abstractKey": null
};
})();

(node as any).hash = "05b19797b2c9f56659df87393ed37c37";

export default node;
