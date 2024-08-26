import { interfaceType, objectType, stringArg } from "nexus";
import { connectionFromArray } from "packages/graphql/deps.ts";
import {
  BlogPostData,
  getBlogPostsFromNotion,
  getListOfContentForAPost,
  NotionBlogPostContent,
} from "lib/notionApi.ts";

export const Blog = objectType({
  name: "Blog",
  definition(t) {
    t.string("title");
    t.connectionField("posts", {
      type: "BlogPost",
      additionalArgs: {
        slug: stringArg(),
        status: stringArg(),
      },
      resolve: async (_, args) => {
        let posts: BlogPostData[] = await getBlogPostsFromNotion();
        if (args.slug) {
          posts = posts.filter((post) => post.slug === args.slug);
        } else if (args.status) {
          posts = posts.filter((post) => post.status === args.status);
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
    t.list.field("content", {
      type: "BlogPostContentBlock",
      resolve: async (parent) => {
        const content: NotionBlogPostContent[] = await getListOfContentForAPost(
          parent.id,
        );
        return content; // Directly return the list
      },
    });
    t.string("status");
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
      case "paragraph":
        return "ParagraphBlock";
      case "image":
        return "ImageBlock";
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

export const ImageBlock = objectType({
  name: "ImageBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.string("imgUrl");
    t.list.field("caption", {type: "RichText" });
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
    t.string("link");
  },
});

export const RichText = objectType({
  name: "RichText",
  definition(t) {
    t.string("type");
    t.field("text", {
      type: "Text",
    });
    t.field('annotations', {
      type: "Annotations",
    });
  },
});