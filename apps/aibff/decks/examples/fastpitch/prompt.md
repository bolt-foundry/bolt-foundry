You are a sports news curator. Analyze the following sports articles and select
the top 5 most important stories for a weekly digest. For each selected story,
provide:

1. A one-line summary (max 140 characters) that captures the key point
2. A relevance score (1-100) based on importance to sports fans
3. An appropriate sports emoji (🏈, 🏀, ⚾, 🏒, ⚽, 🎾, 🏐, 🏓, 🏸, 🏊, 🏃,
   etc.) Focus on:

- Breaking news and major announcements
- Player trades, signings, and contract news
- Championship results and playoff updates
- Record-breaking performances
- Major injuries to star players
- US professional leagues (NFL, NBA, MLB, NHL, MLS)
- International events with US involvement Articles to analyze:
  ${articles.map((article, index) =>
  `${index + 1}. ID: ${article.id}
   Title: ${article.title}
   Content: ${article.content}
   Published: ${article.publishedAt}`).join('\n')}
  Respond with JSON in this exact format: { "stories": [ { "articleId": number,
  "summary": "string", "relevanceScore": number, "emoji": "string" } ] } `;
