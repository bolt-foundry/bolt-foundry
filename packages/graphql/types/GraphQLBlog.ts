import { enumType, interfaceType, list, objectType, stringArg } from "nexus";
import { connectionFromArray } from "packages/graphql/deps.ts";
import {
  type BlogPostData,
  getBlogPostsFromNotion,
  getListOfContentForAPost,
  type NotionBlogPostContent,
} from "lib/notionApi.ts";
import { formatDateString } from "packages/lib/textUtils.ts";

export const PostStatus = enumType({
  name: "PostStatus",
  members: {
    READY_FOR_PUBLISH: "Ready for publish",
    DEV_ONLY: "Dev only",
    WORKSHOP: "Workshop",
  },
});

export const Blog = objectType({
  name: "Blog",
  definition(t) {
    t.string("title");
    t.connectionField("posts", {
      type: "BlogPost",
      additionalArgs: {
        slug: stringArg(),
        status: list(PostStatus),
        date: stringArg(),
        author: stringArg(),
      },
      resolve: async (_, args) => {
        let posts: BlogPostData[] = await getBlogPostsFromNotion();
        if (args.slug) {
          posts = posts.filter((post) => post.slug === args.slug);
        } else if (args.status) {
          posts = posts.filter((post) => {
            return args.status && args.status.includes(post.status);
          });
        }
        return connectionFromArray(posts, args);
      },
    });
  },
});

export const BlogPost = objectType({
  name: "BlogPost",
  definition(t) {
    t.nonNull.string("id");
    t.string("title");
    t.string("slug");
    t.string("date", {
      resolve: (parent) => parent.date ? formatDateString(parent.date) : null,
    });
    t.field("author", {
      type: "BlogPostAuthor",
      resolve: (parent) => {
        return parent.author;
      },
    });
    t.string("summary");
    t.string("coverUrl");
    t.string("icon");
    t.list.field("content", {
      type: "BlogPostContentBlock",
      resolve: async (parent) => {
        const content: NotionBlogPostContent[] = await getListOfContentForAPost(
          parent.id,
        );
        return content; // Directly return the list
      },
    });
    t.field("status", {
      type: PostStatus,
    });
  },
});

export const BlogPostAuthor = objectType({
  name: "BlogPostAuthor",
  definition(t) {
    t.string("name");
    t.string("email");
    t.string("avatarUrl");
  },
});

export const BlogPostContentBlock = interfaceType({
  name: "BlogPostContentBlock",
  definition(t) {
    t.string("type");
    t.string("id");
  },
  resolveType(item) {
    switch (item.type) {
      case "heading_1":
        return "ParagraphBlock";
      case "heading_2":
        return "ParagraphBlock";
      case "heading_3":
        return "ParagraphBlock";
      case "paragraph":
        return "ParagraphBlock";
      case "image":
        return "ImageBlock";
      case "callout":
        return "CalloutBlock";
      case "code":
        return "CodeBlock";
      default:
        //todo add error logging
        return null;
    }
  },
});

export const ParagraphBlock = objectType({
  name: "ParagraphBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.list.field("RichText", { type: "RichText" });
    t.string("color", { default: "default" });
  },
});

export const CalloutBlock = objectType({
  name: "CalloutBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.list.field("RichText", { type: "RichText" });
    t.string("icon");
    t.string("color");
  },
});

export const CodeBlock = objectType({
  name: "CodeBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.list.field("RichText", { type: "RichText" });
    t.string("language");
  },
});

export const ImageBlock = objectType({
  name: "ImageBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.string("imgUrl");
    t.list.field("caption", { type: "RichText" });
  },
});

export const Annotations = objectType({
  name: "Annotations",
  definition(t) {
    t.boolean("bold");
    t.boolean("italic");
    t.boolean("strikethrough");
    t.boolean("underlined");
    t.boolean("code");
    t.string("color");
  },
});

export const TextObject = objectType({
  name: "Text",
  definition(t) {
    t.string("content");
    t.field("link", {
      type: "Link",
    });
  },
});

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.string("url");
  },
});

export const RichText = objectType({
  name: "RichText",
  definition(t) {
    t.string("type");
    t.field("text", {
      type: "Text",
    });
    t.field("annotations", {
      type: "Annotations",
    });
  },
});
