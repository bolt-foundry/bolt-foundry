// cms: https://www.notion.so/boltfoundry/1d6117a9a86441f1b339e96346bbf0e1?v=887423b5acf24d93b501bd3975b0c11e
const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
const NOTION_BLOG_ID = "1d6117a9a86441f1b339e96346bbf0e1";

export interface NotionPostsResponse {
  id: string;
  url: string;
  title: string;
  slug: string;
  properties: NotionPostsResponseDataProperties;
}

export interface BlogPostData {
  title: string;
  slug: string;
  id: string;
}

interface NotionPostsResponseDataProperties {
  Name: {
    title: [{
      text: {
        content: string;
      }
    }]
  }
}

export interface NotionBlogPostResponse {
  type: string;
  id: string;
}

export interface NotionBlogPostContent {
  type: string;
  id: string;
}

export async function getBlogPostsFromNotion(): Promise<[BlogPostData]> {
  const response = await fetch('https://api.notion.com/v1/databases/1d6117a9a86441f1b339e96346bbf0e1/query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();
  const filteredData = data.results.map(({ id, url, properties}: NotionPostsResponse) => {
    const lastDashIndex = url.lastIndexOf("-");
    const urlWithoutId = url.substring(0, lastDashIndex);
    const slug = urlWithoutId.replace('https://www.notion.so/', '');
    return {
      title: properties.Name.title[0].text.content,
      slug: slug,
      id: id,
    }
  });
  return filteredData;
}

export async function getListOfContentForAPost(id: string): Promise<[NotionBlogPostContent]> {
  const response = await fetch (`https://api.notion.com/v1/blocks/${id}/children?page_size=100`,  // todo add page_size functionality.
   {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
     },
   });
  const data = await response.json();
  const filteredData = data.results.map(({ type, id }: NotionBlogPostResponse) => {
    return {
      type: type,
      id: id,
    }
  });
  return filteredData;
}

//functions below are for testing only

export async function getRawPostData(slug: string) {
  const response = await fetch (`https://api.notion.com/v1/blocks/${slug}/children?page_size=100`,
   {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
     },
   });
  const data = await response.json();
  return data;
}



export async function getRawDataForAllPosts(): Promise<[BlogPostData]> {
  const response = await fetch('https://api.notion.com/v1/databases/1d6117a9a86441f1b339e96346bbf0e1/query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();
  return data;
}