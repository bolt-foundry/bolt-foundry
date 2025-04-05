import { NextApiRequest, NextApiResponse } from 'next';
import { createOpenAIFetch } from '../../../../packages/bolt-foundry/bolt-foundry';

// Create enhanced fetch with analytics tracking
const openAiFetch = createOpenAIFetch({
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  posthogApiKey: process.env.POSTHOG_NEXTJS_API_KEY || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Make request to OpenAI API using the enhanced fetch from bolt-foundry
    const response = await openAiFetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch from OpenAI');
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    return res.status(200).json({ content: assistantResponse });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message || 'Failed to process request' });
  }
}