import { NextRequest, NextResponse } from 'next/server';

interface GenerateHintRequest {
  question: {
    id: string;
    title: string;
    description: string;
    starterCode: string;
    solution: string;
    difficulty: string;
    concepts: string[];
  };
  userCode: string;
  previousHints: {
    text: string;
    level: number;
  }[];
  userProgress: {
    questionsCompleted: number;
    currentStreak: number;
    conceptsLearned: string[];
  };
  attemptHistory: {
    code: string;
    timestamp: number;
    wasSuccessful: boolean;
  }[];
  preferredProvider?: 'claude' | 'openai';
}

interface HintResponse {
  hints: {
    text: string;
    level: number;
    type: 'socratic' | 'direct' | 'example';
  }[];
  shouldShowSolution: boolean;
  encouragement?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateHintRequest = await request.json();
    const { 
      question, 
      userCode, 
      previousHints, 
      userProgress,
      attemptHistory,
      preferredProvider = 'claude' 
    } = body;

    // Generate hints using selected LLM provider
    let hintResponse: HintResponse;
    
    if (preferredProvider === 'claude') {
      hintResponse = await generateHintWithClaude(
        question, 
        userCode, 
        previousHints, 
        userProgress,
        attemptHistory
      );
    } else {
      hintResponse = await generateHintWithOpenAI(
        question, 
        userCode, 
        previousHints, 
        userProgress,
        attemptHistory
      );
    }

    return NextResponse.json(hintResponse);
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}

async function generateHintWithClaude(
  question: GenerateHintRequest['question'],
  userCode: string,
  previousHints: GenerateHintRequest['previousHints'],
  userProgress: GenerateHintRequest['userProgress'],
  attemptHistory: GenerateHintRequest['attemptHistory']
): Promise<HintResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not found in environment variables');
  }

  const prompt = buildHintPrompt(question, userCode, previousHints, userProgress, attemptHistory);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const hintText = data.content[0].text;

  return parseHintResponse(hintText);
}

async function generateHintWithOpenAI(
  question: GenerateHintRequest['question'],
  userCode: string,
  previousHints: GenerateHintRequest['previousHints'],
  userProgress: GenerateHintRequest['userProgress'],
  attemptHistory: GenerateHintRequest['attemptHistory']
): Promise<HintResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  const prompt = buildHintPrompt(question, userCode, previousHints, userProgress, attemptHistory);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const hintText = data.choices[0].message.content;

  return parseHintResponse(hintText);
}

function buildHintPrompt(
  question: GenerateHintRequest['question'],
  userCode: string,
  previousHints: GenerateHintRequest['previousHints'],
  userProgress: GenerateHintRequest['userProgress'],
  attemptHistory: GenerateHintRequest['attemptHistory']
): string {
  const hintsUsed = previousHints.length;
  const isStruggling = hintsUsed >= 2 || attemptHistory.length >= 4;
  
  return `You are a patient JavaScript tutor helping a student who is ${isStruggling ? 'struggling and may be getting frustrated' : 'working through a problem'}. 

QUESTION CONTEXT:
Title: ${question.title}
Description: ${question.description}
Concepts: ${question.concepts.join(', ')}
Difficulty: ${question.difficulty}

STARTER CODE:
${question.starterCode}

CORRECT SOLUTION:
${question.solution}

STUDENT'S CURRENT CODE:
${userCode}

PREVIOUS HINTS GIVEN:
${previousHints.length > 0 ? previousHints.map((hint, i) => `${i + 1}. ${hint.text}`).join('\n') : 'None yet'}

STUDENT PROGRESS:
- Questions completed: ${userProgress.questionsCompleted}
- Current streak: ${userProgress.currentStreak}
- Concepts learned: ${userProgress.conceptsLearned.join(', ') || 'Just starting'}

ATTEMPT HISTORY:
${attemptHistory.length > 0 ? attemptHistory.map((attempt, i) => 
  `Attempt ${i + 1}: ${attempt.wasSuccessful ? 'Success' : 'Failed'} - ${attempt.code.substring(0, 100)}...`
).join('\n') : 'First attempt'}

INSTRUCTIONS:
${isStruggling ? `
The student is struggling (${hintsUsed} hints used, ${attemptHistory.length} attempts). They may be getting frustrated.

1. If they're close to the solution, give them the answer with a clear explanation
2. If they're far off, provide 1-2 direct, helpful hints that move them significantly forward
3. Always be encouraging and explain the "why" behind your suggestions
` : `
The student is making good progress. Use the Socratic method:

1. Ask leading questions that guide them to discover the solution
2. Point out what they're doing right
3. Give gentle nudges in the right direction
4. Don't give away the answer unless they're really stuck
`}

Respond with ONLY a JSON object in this exact format:
{
  "hints": [
    {
      "text": "Your hint text here - be specific and helpful",
      "level": ${hintsUsed + 1},
      "type": "${isStruggling ? 'direct' : 'socratic'}"
    }
  ],
  "shouldShowSolution": ${isStruggling && hintsUsed >= 3 ? 'true' : 'false'},
  "encouragement": "Brief encouraging message about their progress"
}

If shouldShowSolution is true, include the solution explanation in the hint text.
Be encouraging but honest about what they need to work on.`;
}

function parseHintResponse(responseText: string): HintResponse {
  try {
    // Clean up the response text to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsed.hints || !Array.isArray(parsed.hints)) {
      throw new Error('Invalid hints array in response');
    }
    
    // Ensure each hint has required fields
    parsed.hints.forEach((hint: any, index: number) => {
      if (!hint.text || typeof hint.level !== 'number' || !hint.type) {
        throw new Error(`Invalid hint at index ${index}`);
      }
    });
    
    return {
      hints: parsed.hints,
      shouldShowSolution: Boolean(parsed.shouldShowSolution),
      encouragement: parsed.encouragement
    };
  } catch (error) {
    console.error('Error parsing hint response:', error);
    console.error('Response text:', responseText);
    
    // Fallback hint if parsing fails
    return {
      hints: [{
        text: "Let me help you think through this step by step. What do you think the function should do first?",
        level: 1,
        type: 'socratic'
      }],
      shouldShowSolution: false,
      encouragement: "You're doing great! Keep trying!"
    };
  }
}