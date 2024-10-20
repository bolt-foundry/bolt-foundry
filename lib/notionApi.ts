// cms: https://www.notion.so/boltfoundry/1d6117a9a86441f1b339e96346bbf0e1?v=887423b5acf24d93b501bd3975b0c11e
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);
const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");

export interface NotionPostsResponse {
  id: string;
  url: string;
  title: string;
  slug: string;
  properties: NotionPostsResponseDataProperties;
  cover: string;
  icon: string;
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
  call_to_action: RichText[];
}

export interface BlogPostData {
  title: string;
  slug: string;
  id: string;
  date: string;
  author: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  coverUrl: string;
  icon: string;
  status: string;
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
  heading_1: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
    size?: string;
    oldType: string;
  };
  heading_2: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
    size?: string;
    oldType: string;
  };
  heading_3: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
    size?: string;
    oldType: string;
  };
}

interface RichText {
  type: string;
  text?: {
    content: string;
    link: { url: string };
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
  logger.debug("RAW DATA", data);
  const filteredData = data.results.map(
    ({ id, url, properties, cover, icon }: NotionPostsResponse) => {
      logger.debug("DATE", properties["Publish date"]);
      logger.debug("AUTHOR", properties.Author);
      logger.debug("COVER", cover);
      const lastDashIndex = url.lastIndexOf("-");
      const urlWithoutId = url.substring(0, lastDashIndex);
      const slug = urlWithoutId.replace("https://www.notion.so/", "");
      return {
        title: properties.Name.title[0]?.text?.content ?? "Untitled",
        slug: slug,
        id: id,
        status: properties.Status.status?.name ?? "No status",
        date: properties["Publish date"]?.date?.start,
        author: {
          name: properties.Author.people[0]?.name,
          email: properties.Author.people[0]?.person?.email,
          avatarUrl: properties.Author.people[0]?.avatar_url,
        },
        summary: properties.Summary.rich_text[0]?.plain_text ?? "",
        coverUrl: cover?.file?.url ?? cover?.external?.url,
        icon: icon?.emoji,
        callToAction: properties["Call to action"]?.rich_text ?? [],
      };
    },
  );
  filteredData.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : null;
    const dateB = b.date ? new Date(b.date) : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
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
        case "heading_1":
          return {
            id: contentBlock.id,
            type: "heading",
            size: "1",
            RichText: contentBlock.heading_1.rich_text,
            color: contentBlock.heading_1.color,
            isToggleable: contentBlock.heading_1.is_toggleable,
          };
        case "heading_2":
          return {
            id: contentBlock.id,
            type: "heading",
            size: "2",
            RichText: contentBlock.heading_2.rich_text,
            color: contentBlock.heading_2.color,
            isToggleable: contentBlock.heading_2.is_toggleable,
          };
        case "heading_3":
          return {
            id: contentBlock.id,
            type: "heading",
            size: "3",
            RichText: contentBlock.heading_3.rich_text,
            color: contentBlock.heading_3.color,
            isToggleable: contentBlock.heading_3.is_toggleable,
          };
        case "image":
          return {
            id: contentBlock.id,
            type: contentBlock.type,
            imgUrl: contentBlock.image.external?.url ??
              contentBlock.image.file?.url,
            caption: contentBlock.image.caption,
          };
        case "paragraph": {
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
