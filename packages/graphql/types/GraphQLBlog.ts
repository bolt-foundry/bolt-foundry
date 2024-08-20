import { objectType, stringArg } from "nexus";
import { connectionFromArray } from "packages/graphql/deps.ts";
import { getBlogPostsFromNotion, BlogPostData, getListOfContentForAPost, NotionBlogPostContent } from "lib/notionApi.ts";

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
        const posts: BlogPostData[] = await getBlogPostsFromNotion();
        return connectionFromArray(posts, args);
      },
    });
  },
});

export const BlogPost = objectType({
  name: "BlogPost",
  definition(t) {
    t.string("title");
    t.string("slug");
    t.string("id");
    t.connectionField("content", {
      type: "BlogPostContentBlock",
      resolve: async (parent, args, ctx) => {
        const content: NotionBlogPostContent[] = await getListOfContentForAPost(parent.id);
        return connectionFromArray(content, args);
      }
    });
  },
});

export const BlogPostContentBlock = objectType({
  name: "BlogPostContentBlock",
  definition(t) {
    t.string("type");
    t.string("id");
  }
})
