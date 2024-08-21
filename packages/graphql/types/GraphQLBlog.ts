import { interfaceType, list, objectType, stringArg } from "nexus";
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
      },
      resolve: async (_, args, ctx) => {
        let posts: BlogPostData[] = await getBlogPostsFromNotion();
        if (args.slug) {
          posts = posts.filter((post) => post.slug === args.slug);
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
      resolve: async (parent, args, ctx) => {
        const content: NotionBlogPostContent[] = await getListOfContentForAPost(
          parent.id,
        );
        return content; // Directly return the list
      },
    });
  },
});

export const ParagraphBlock = objectType({
  name: "ParagraphBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.string("id");
    t.string("type");
    t.string("rawText");
  },
});
export const ImageBlock = objectType({
  name: "ImageBlock",
  definition(t) {
    t.implements("BlogPostContentBlock");
    t.string("id");
    t.string("type");
    t.string("imgUrl");
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
