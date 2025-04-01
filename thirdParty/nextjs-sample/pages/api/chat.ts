
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToOpenAi } from "@bolt-foundry/bolt-foundry";


const openai = createOpenAI({
  fetch: connectToOpenAi(process.env.OPENAI_API_KEY, process.env.POSTHOG_API_KEY_FOR_NEXT),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    const response = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: message,
      maxTokens: 500,
      
    });

    res.status(200).json({ 
      response: { text: response.text || response }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
