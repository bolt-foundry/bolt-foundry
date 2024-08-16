// cms: https://www.notion.so/boltfoundry/1d6117a9a86441f1b339e96346bbf0e1?v=887423b5acf24d93b501bd3975b0c11e
const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
const NOTION_BLOG_ID = "1d6117a9a86441f1b339e96346bbf0e1";

export async function getBlogPostsFromNotion() {
  const response = await fetch('https://api.notion.com/v1/databases/1d6117a9a86441f1b339e96346bbf0e1/query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
  });
  //not complete, data needs to be formatted.
  const data = await response.json();
  return data;
}

export async function getBlogPostFromNotion(slug: string) {
  const response = await fetch (`https://api.notion.com/v1/blocks/${slug}/children?page_size=100`,  //what defines pageSize, number of blocks returned?
   {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
     },
   });
  //not complete, data needs to be formatted.
  const data = await response.json();
  return data;
}
