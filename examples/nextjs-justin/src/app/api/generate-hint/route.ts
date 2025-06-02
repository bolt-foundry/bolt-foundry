import { NextRequest, NextResponse } from 'next/server';
import { BfClient } from "@bolt-foundry/bolt-foundry-next";

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

  const assistantCard = getHintAssistantCard(question, userCode, previousHints, userProgress, attemptHistory);
  const cardData = assistantCard.assistant.render({
    model: 'claude-3-haiku-20240307',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: ""
      }
    ],
    context: assistantCard.contextData,
  })

  const response = await fetch('https://api.anthropic.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(cardData)
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const hintText = data.choices[0].message.content;

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

  const assistantCard = getHintAssistantCard(question, userCode, previousHints, userProgress, attemptHistory);
  const cardData = assistantCard.assistant.render({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: ""
      }
    ],
    max_tokens: 800,
    temperature: 0.7,
    context: assistantCard.contextData,
  })

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(cardData)
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const hintText = data.choices[0].message.content;

  return parseHintResponse(hintText);
}

function getHintAssistantCard(
  question: GenerateHintRequest['question'],
  userCode: string,
  previousHints: GenerateHintRequest['previousHints'],
  userProgress: GenerateHintRequest['userProgress'],
  attemptHistory: GenerateHintRequest['attemptHistory']
) {
  // Initialize Bolt Foundry client
  const bf = BfClient.create();

  const hintsUsed = previousHints.length;
  const isStruggling = hintsUsed >= 2 || attemptHistory.length >= 4;

  // Create assistant card for JavaScript tutor hints
  const assistant = bf.createAssistantCard("javascript-tutor-hints", (card) =>
    card
      .spec("You are a patient JavaScript tutor helping students with coding problems")
      .spec("Provide helpful hints without giving away the complete solution too early")
      .spec("Use the Socratic method for students making progress, be more direct for struggling students")
      .spec("Always be encouraging and explain the reasoning behind suggestions")
      .specs("Behaviors", (behavior) => (
        behavior
          .spec("Return ONLY a JSON object with no additional text")
          .spec("Escape all newlines in JSON string values as \\n")
          .spec("Use appropriate hint types: 'socratic' for guided discovery, 'direct' for struggling students, 'example' for code examples")
          .spec("Provide encouragement that acknowledges their effort and progress")
          .spec("If student is very stuck, consider showing the solution with explanation")
      ))
      .context((ctx) =>
        ctx
          .string("questionTitle", "What is the title of the coding question?")
          .string("questionDescription", "What is the description of the coding question?")
          .string("questionConcepts", "What concepts does this question cover?")
          .string("questionDifficulty", "What is the difficulty level of this question?")
          .string("starterCode", "What is the starter code provided?")
          .string("correctSolution", "What is the correct solution to the problem?")
          .string("userCode", "What is the student's current code attempt?")
          .string("previousHints", "What hints have already been given?")
          .number("hintsUsed", "How many hints have been used so far?")
          .boolean("isStruggling", "Is the student struggling with this problem?")
      )
      .context((ctx) =>
        ctx
          .number("questionsCompleted", "How many questions has the student completed?")
          .number("currentStreak", "What's the current streak of correct answers?")
          .string("conceptsLearned", "Which concepts has the student already learned?")
          .string("attemptHistory", "What attempts has the student made?")
          .string("jsonFormat", "What is the exact JSON format for the hint response?")
      )
  );

  // Prepare context data
  const contextData = {
    questionTitle: question.title,
    questionDescription: question.description,
    questionConcepts: question.concepts.join(', '),
    questionDifficulty: question.difficulty,
    starterCode: question.starterCode,
    correctSolution: question.solution,
    userCode: userCode,
    previousHints: previousHints.length > 0 ? previousHints.map((hint, i) => `${i + 1}. ${hint.text}`).join('\\n') : 'None yet',
    hintsUsed: hintsUsed,
    isStruggling: isStruggling,
    questionsCompleted: userProgress.questionsCompleted,
    currentStreak: userProgress.currentStreak,
    conceptsLearned: userProgress.conceptsLearned.join(', ') || 'Just starting',
    attemptHistory: attemptHistory.length > 0 ? attemptHistory.map((attempt, i) => 
      `Attempt ${i + 1}: ${attempt.wasSuccessful ? 'Success' : 'Failed'} - ${attempt.code.substring(0, 100)}...`
    ).join('\\n') : 'First attempt',
    jsonFormat: `{
  "hints": [
    {
      "text": "Your hint text here - be specific and helpful",
      "level": ${hintsUsed + 1},
      "type": "${isStruggling ? 'direct' : 'socratic'}"
    }
  ],
  "shouldShowSolution": ${isStruggling && hintsUsed >= 3 ? 'true' : 'false'},
  "encouragement": "Brief encouraging message about their progress"
}`
  };

  return { assistant, contextData };
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