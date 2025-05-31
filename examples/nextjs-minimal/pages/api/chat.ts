import { NextApiRequest, NextApiResponse } from 'next'
import { BfClient, connectBoltFoundry } from '@bolt-foundry/bolt-foundry-next'
import OpenAI from 'openai'

// Create a Bolt Foundry client instance
const bfClient = BfClient.create()

// Define a simple assistant deck with a persona
// This deck defines how the AI should behave
const assistantDeck = bfClient.createAssistantDeck(
  'helpful-assistant',
  (builder) =>
    builder
      .spec('You are a helpful, friendly assistant. Keep your responses concise and clear.')
      // You can add context parameters here if needed
      // .context((ctx) => ctx.string('userName', 'The user\'s name'))
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body

    // Get OpenAI API key from environment
    const openAIApiKey = process.env.OPENAI_API_KEY
    
    if (!openAIApiKey) {
      return res.status(400).json({ 
        error: 'OpenAI API key not configured',
        message: 'Please set the OPENAI_API_KEY environment variable.',
        helpUrl: 'https://platform.openai.com/api-keys'
      })
    }

    // Create OpenAI client with Bolt Foundry telemetry
    const client = new OpenAI({
      apiKey: openAIApiKey,
      // connectBoltFoundry wraps the fetch function to add telemetry
      fetch: connectBoltFoundry(
        // Optional: Add your PostHog API key for analytics
        // Format: 'bf+YOUR_POSTHOG_KEY'
        undefined
      ),
    })

    // Render the assistant deck with the current conversation
    const completion = await client.chat.completions.create(
      assistantDeck.render({
        model: 'gpt-3.5-turbo',
        messages,
        // Add any context values here
        // context: { userName: 'User' }
      })
    )

    // Extract the assistant's response
    const assistantResponse = completion.choices[0].message.content

    // Return the response
    return res.status(200).json({ content: assistantResponse })
  } catch (error: any) {
    console.error('Error in chat API:', error)
    
    // Return a user-friendly error message
    return res.status(500).json({
      error: 'Failed to process request',
      message: error.message || 'Something went wrong'
    })
  }
}