import { iso } from "@bfmono/apps/aibff/gui/__generated__/__isograph/iso.ts";
import { BfDsList } from "@bfmono/apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";
import { BfDsCallout } from "@bfmono/apps/bfDs/components/BfDsCallout.tsx";

export const ConversationDisplay = iso(`
  field Query.ConversationDisplay @component {
    conversations {
      id
      createdAt
      messages {
        id
        content
        role
        createdAt
      }
    }
  }
`)(function ConversationDisplayComponent(data) {
  return (
    <div
      style={{ padding: "1rem", backgroundColor: "#1c1c1c", color: "#fafaff" }}
    >
      <h2>Conversations</h2>
      {data.data.conversations.length === 0
        ? (
          <BfDsCallout variant="info">
            No conversations yet
          </BfDsCallout>
        )
        : (
          <BfDsList>
            {data.data.conversations.map((conv) => (
              <BfDsListItem
                key={conv.id}
                expandContents={
                  <BfDsList>
                    {conv.messages.map((msg) => (
                      <BfDsListItem key={msg.id}>
                        [{msg.role}] {msg.content}
                      </BfDsListItem>
                    ))}
                  </BfDsList>
                }
              >
                <strong>Conversation {conv.id}</strong> - {conv.createdAt}
              </BfDsListItem>
            ))}
          </BfDsList>
        )}
    </div>
  );
});
