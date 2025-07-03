import { iso } from "@bfmono/apps/aibff/gui/__generated__/__isograph/iso.ts";

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
      {data.data.conversations.length === 0 ? <p>No conversations yet</p> : (
        <ul>
          {data.data.conversations.map((conv) => (
            <li key={conv.id}>
              <strong>Conversation {conv.id}</strong> - {conv.createdAt}
              <ul>
                {conv.messages.map((msg) => (
                  <li key={msg.id}>
                    [{msg.role}] {msg.content}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
