const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
const BFI_NOTION_DATABASE_ID = Deno.env.get("BFI_NOTION_DATABASE_ID");

interface ClipTaskNotionRow<T = Record<string, unknown>> {
  icon: Record<string, unknown>;
  properties: T;
  children: Record<string, unknown>[];
}

export async function addRowToNotion(
  row: ClipTaskNotionRow,
): Promise<Response> {
  const url = `https://api.notion.com/v1/pages`;

  const payload = {
    ...row,
    parent: { database_id: BFI_NOTION_DATABASE_ID },
  };

  const headers = {
    "Authorization": `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  return response;
}
