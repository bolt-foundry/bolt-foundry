/**
 * @generated SignedSource<<4a06bc3131ef5d6fd235b7962997ddb5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type PostStatus = "DEV_ONLY" | "READY_FOR_PUBLISH" | "WORKSHOP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type BlogPostContentFragment$data = {
  readonly author: {
    readonly avatarUrl: string | null | undefined;
    readonly email: string | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
  readonly callToAction: ReadonlyArray<{
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
    readonly type: string | null | undefined;
  } | null | undefined> | null | undefined;
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
      readonly type?: string | null | undefined;
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
    readonly isToggleable?: boolean | null | undefined;
    readonly language?: string | null | undefined;
    readonly size?: string | null | undefined;
    readonly type?: string | null | undefined;
  } | null | undefined> | null | undefined;
  readonly coverUrl: string | null | undefined;
  readonly date: string | null | undefined;
  readonly icon: string | null | undefined;
  readonly id: string;
  readonly slug: string | null | undefined;
  readonly status: PostStatus | null | undefined;
  readonly summary: string | null | undefined;
  readonly title: string | null | undefined;
  readonly " $fragmentType": "BlogPostContentFragment";
};
export type BlogPostContentFragment$key = {
  readonly " $data"?: BlogPostContentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BlogPostContentFragment">;
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
  "name": "color",
  "storageKey": null
},
v3 = {
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
    (v2/*: any*/),
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
},
v4 = {
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = [
  (v4/*: any*/),
  (v3/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "RichText",
  "kind": "LinkedField",
  "name": "RichText",
  "plural": true,
  "selections": (v6/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BlogPostContentFragment",
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
      "concreteType": "RichText",
      "kind": "LinkedField",
      "name": "callToAction",
      "plural": true,
      "selections": [
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/)
      ],
      "storageKey": null
    },
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
            (v5/*: any*/),
            (v2/*: any*/),
            (v7/*: any*/)
          ],
          "type": "ParagraphBlock",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "size",
              "storageKey": null
            },
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isToggleable",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "RichText",
              "kind": "LinkedField",
              "name": "RichText",
              "plural": true,
              "selections": [
                (v4/*: any*/),
                (v3/*: any*/),
                (v5/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "type": "HeadingBlock",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v5/*: any*/),
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
              "selections": (v6/*: any*/),
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
            (v5/*: any*/),
            (v2/*: any*/),
            (v1/*: any*/),
            (v7/*: any*/)
          ],
          "type": "CalloutBlock",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "language",
              "storageKey": null
            },
            (v7/*: any*/)
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

(node as any).hash = "ef6fa58de8f962baf611523cefccc0e0";

export default node;
