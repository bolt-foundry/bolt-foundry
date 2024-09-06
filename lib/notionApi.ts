// cms: https://www.notion.so/boltfoundry/1d6117a9a86441f1b339e96346bbf0e1?v=887423b5acf24d93b501bd3975b0c11e
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");

export interface NotionPostsResponse {
  id: string;
  url: string;
  title: string;
  slug: string;
  properties: NotionPostsResponseDataProperties;
}

interface NotionPostsResponseDataProperties {
  Status: {
    status: {
      name: string;
    };
  };
  Name: {
    title: [{
      text: {
        content: string;
      };
    }];
  };
}

export interface BlogPostData {
  title: string;
  slug: string;
  id: string;
}

export interface NotionBlogPostContentObject {
  type: string;
  id: string;
  image: {
    caption: RichText[];
    external?: {
      url: string;
    };
    file?: {
      url: string;
    };
  };
  paragraph: {
    rich_text: RichText[];
    color: string;
  };
  callout: {
    rich_text: RichText[];
    color: string;
    icon: {
      type: string;
      emoji: string;
    };
  };
  code: {
    rich_text: RichText[];
    language: string;
  };
}

export interface RichText {
  type: string;
  text: {
    content: string;
    link: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underlined: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string;
}

export interface NotionBlogPostContent {
  type: string;
  id: string;
}

// Returns an array of all blog posts from the Notion database
export async function getBlogPostsFromNotion(): Promise<[BlogPostData]> {
  const response = await fetch(
    "https://api.notion.com/v1/databases/1d6117a9a86441f1b339e96346bbf0e1/query",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  const filteredData = data.results.map(
    ({ id, url, properties }: NotionPostsResponse) => {
      const lastDashIndex = url.lastIndexOf("-");
      const urlWithoutId = url.substring(0, lastDashIndex);
      const slug = urlWithoutId.replace("https://www.notion.so/", "");
      return {
        title: properties.Name.title[0]?.text?.content ?? "Untitled",
        slug: slug,
        id: id,
        status: properties.Status.status?.name ?? "No status",
      };
    },
  );
  return filteredData;
}

// Returns an array of all of the ContentBlocks for a given blog post.
export async function getListOfContentForAPost(
  id: string,
): Promise<[NotionBlogPostContent]> {
  const response = await fetch(
    `https://api.notion.com/v1/blocks/${id}/children?page_size=100`, // todo add page_size functionality.
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  const filteredData = data.results.map(
    (contentBlock: NotionBlogPostContentObject) => {
      //todo refactor so that common items such as id and type are deconstructed from a common object.
      switch (contentBlock.type) {
        case "image":
          return {
            id: contentBlock.id,
            type: contentBlock.type,
            imgUrl: contentBlock.image.external?.url ??
              contentBlock.image.file?.url,
            caption: contentBlock.image.caption,
          };
        case "paragraph": {
          let textString = "";
          contentBlock.paragraph.rich_text.forEach((rich_text) => {
            textString += rich_text.plain_text;
          });
          return {
            id: contentBlock.id,
            type: contentBlock.type,
            RichText: contentBlock.paragraph.rich_text,
            color: contentBlock.paragraph.color,
          };
        }
        case "callout": {
          return {
            id: contentBlock.id,
            type: contentBlock.type,
            RichText: contentBlock.callout.rich_text,
            icon: contentBlock.callout.icon?.emoji,
            color: contentBlock.callout.color,
          };
        }
        case "code": {
          return {
            id: contentBlock.id,
            type: contentBlock.type,
            RichText: contentBlock.code.rich_text,
            language: contentBlock.code.language,
          };
        }
        default: {
          logger.error("Unknown content type", contentBlock.type, contentBlock);
          return;
        }
      }
    },
  );
  return filteredData;
}

//functions below are for testing only

export async function getRawPostData(slug: string) {
  const response = await fetch(
    `https://api.notion.com/v1/blocks/${slug}/children?page_size=100`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    },
  );
  return await response.json();
}

export async function getRawDataForAllPosts(): Promise<[BlogPostData]> {
  const response = await fetch(
    "https://api.notion.com/v1/databases/1d6117a9a86441f1b339e96346bbf0e1/query",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    },
  );
  return await response.json();
}
