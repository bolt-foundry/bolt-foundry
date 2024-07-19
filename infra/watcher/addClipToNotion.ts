#! /usr/bin/env -S deno run -A

import { notifyDiscord } from "infra/watcher/ingest.ts";
import { addRowToNotion } from "infra/watcher/notionApi.ts";

if (import.meta.main) {
  const res = await addClipToNotion(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "main test",
  );
  const url = (await res.json()).url;
  await notifyDiscord(`<@&1210008885193211944> New task: ${url}`);
}

export function addClipToNotion(urlToSandbox: string, taskTitle: string) {
  return addRowToNotion({
    icon: {
      type: "emoji",
      emoji: "📎", // You can change this icon according to your requirement.
    },
    properties: {
      "Task name": {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: taskTitle,
            },
          },
        ],
      },
      "link to sandbox": {
        type: "url",
        url: urlToSandbox,
      },
    },
    children: [],
  });
}
