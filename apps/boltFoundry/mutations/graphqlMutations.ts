/**
 * Simple GraphQL mutation and query functions for Formatter.tsx
 * These call the GraphQL API directly without Isograph
 */

export interface CreateBoltData {
  name: string;
  description?: string;
  originalPrompt: string;
}

export interface CreateBoltResponse {
  success: boolean;
  message?: string;
  id?: string;
}

export interface UpdateBoltData {
  id: string;
  name?: string;
  description?: string;
  status?: string;
}

export interface CardData {
  id?: string;
  boltId?: string;
  title: string;
  kind: string;
  text: string;
  transition?: string;
  order?: number;
}

export interface VariableData {
  id?: string;
  boltId?: string;
  name: string;
  description?: string;
  defaultValue?: string;
  order?: number;
}

export interface TurnData {
  id?: string;
  boltId?: string;
  speaker: string;
  message: string;
  order?: number;
}

export async function createBolt(data: CreateBoltData): Promise<CreateBoltResponse> {
  try {
    // TODO: Replace with actual GraphQL call
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateBolt($name: String!, $description: String, $originalPrompt: String!) {
            createBolt(name: $name, description: $description, originalPrompt: $originalPrompt) {
              success
              message
              id
            }
          }
        `,
        variables: data,
      }),
    });

    const result = await response.json();
    return result.data.createBolt;
  } catch (error) {
    console.error('Error creating bolt:', error);
    return { success: false, message: 'Failed to create bolt' };
  }
}

export async function updateBolt(data: UpdateBoltData): Promise<CreateBoltResponse> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation UpdateBolt($id: ID!, $name: String, $description: String, $status: String) {
            updateBolt(id: $id, name: $name, description: $description, status: $status) {
              success
              message
            }
          }
        `,
        variables: data,
      }),
    });

    const result = await response.json();
    return result.data.updateBolt;
  } catch (error) {
    console.error('Error updating bolt:', error);
    return { success: false, message: 'Failed to update bolt' };
  }
}

export async function addCard(data: CardData): Promise<CreateBoltResponse> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddCard($boltId: ID!, $title: String!, $kind: String!, $text: String!, $transition: String, $order: Int) {
            addCard(boltId: $boltId, title: $title, kind: $kind, text: $text, transition: $transition, order: $order) {
              success
              message
            }
          }
        `,
        variables: data,
      }),
    });

    const result = await response.json();
    return result.data.addCard;
  } catch (error) {
    console.error('Error adding card:', error);
    return { success: false, message: 'Failed to add card' };
  }
}

export async function updateCard(data: CardData): Promise<CreateBoltResponse> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation UpdateCard($id: ID!, $title: String, $text: String, $transition: String, $order: Int) {
            updateCard(id: $id, title: $title, text: $text, transition: $transition, order: $order) {
              success
              message
            }
          }
        `,
        variables: data,
      }),
    });

    const result = await response.json();
    return result.data.updateCard;
  } catch (error) {
    console.error('Error updating card:', error);
    return { success: false, message: 'Failed to update card' };
  }
}

export async function deleteCard(id: string): Promise<CreateBoltResponse> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteCard($id: ID!) {
            deleteCard(id: $id) {
              success
              message
            }
          }
        `,
        variables: { id },
      }),
    });

    const result = await response.json();
    return result.data.deleteCard;
  } catch (error) {
    console.error('Error deleting card:', error);
    return { success: false, message: 'Failed to delete card' };
  }
}

// Query Functions
export interface BoltData {
  id: string;
  name: string;
  description?: string;
  status: string;
  originalPrompt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryResponse<T> {
  data?: T;
  error?: string;
}

export async function getBolt(id: string): Promise<QueryResponse<BoltData>> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetBolt($id: ID!) {
            bolt(id: $id) {
              id
              name
              description
              status
              originalPrompt
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { error: result.errors[0].message };
    }
    
    return { data: result.data.bolt };
  } catch (error) {
    console.error('Error fetching bolt:', error);
    return { error: 'Failed to fetch bolt' };
  }
}

export async function getCardsByBolt(boltId: string): Promise<QueryResponse<CardData[]>> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetCardsByBolt($boltId: ID!) {
            cardsByBolt(boltId: $boltId) {
              id
              title
              kind
              text
              transition
              order
              boltId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { boltId },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { error: result.errors[0].message };
    }
    
    return { data: result.data.cardsByBolt || [] };
  } catch (error) {
    console.error('Error fetching cards:', error);
    return { error: 'Failed to fetch cards' };
  }
}

export async function getVariablesByBolt(boltId: string): Promise<QueryResponse<VariableData[]>> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetVariablesByBolt($boltId: ID!) {
            variablesByBolt(boltId: $boltId) {
              id
              name
              description
              defaultValue
              order
              boltId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { boltId },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { error: result.errors[0].message };
    }
    
    return { data: result.data.variablesByBolt || [] };
  } catch (error) {
    console.error('Error fetching variables:', error);
    return { error: 'Failed to fetch variables' };
  }
}

export async function getTurnsByBolt(boltId: string): Promise<QueryResponse<TurnData[]>> {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetTurnsByBolt($boltId: ID!) {
            turnsByBolt(boltId: $boltId) {
              id
              speaker
              message
              order
              boltId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { boltId },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { error: result.errors[0].message };
    }
    
    return { data: result.data.turnsByBolt || [] };
  } catch (error) {
    console.error('Error fetching turns:', error);
    return { error: 'Failed to fetch turns' };
  }
}

// LLM Service Types
export interface LLMCard {
  name: string;
  message: string;
  kind?: string;
}

export interface LLMResponse {
  cards: LLMCard[];
}

export interface ProcessPromptResponse {
  success: boolean;
  data?: LLMResponse;
  error?: string;
}

// LLM Service Function
export async function processPromptWithLLM(prompt: string): Promise<ProcessPromptResponse> {
  try {
    // For now, return mock data that follows the expected structure
    // TODO: Replace with actual LLM API call
    const mockResponse: LLMResponse = {
      cards: [
        {
          name: "Introduction",
          message: "Set the context and purpose of this prompt interaction.",
          kind: "behavior"
        },
        {
          name: "Assistant Persona", 
          message: "Define the role and characteristics the assistant should embody.",
          kind: "persona"
        },
        {
          name: "Task Definition",
          message: "Clearly specify what the assistant needs to accomplish.",
          kind: "behavior"
        },
        {
          name: "Output Format",
          message: "Specify the expected structure and format of responses.",
          kind: "tool"
        },
        {
          name: "Constraints",
          message: "Define any limitations, boundaries, or requirements.",
          kind: "behavior"
        }
      ]
    };

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: mockResponse
    };
  } catch (error) {
    console.error('Error processing prompt with LLM:', error);
    return {
      success: false,
      error: 'Failed to process prompt with LLM'
    };
  }
}