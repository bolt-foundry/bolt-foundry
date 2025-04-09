import { NextApiRequest, NextApiResponse } from 'next';
import { connectBoltFoundry } from '@bolt-foundry/bolt-foundry';
import OpenAI from "openai";
const client = new OpenAI({
  fetch: connectBoltFoundry(process.env.POSTHOG_NEXTJS_API_KEY)
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      
    })
    
    const assistantResponse = response.choices[0].message.content;

    return res.status(200).json({ content: assistantResponse });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message || 'Failed to process request' });
  }
}