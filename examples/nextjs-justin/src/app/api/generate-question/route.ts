import { NextRequest, NextResponse } from 'next/server';
import { BfClient } from "@bolt-foundry/bolt-foundry-next";

interface GenerateQuestionRequest {
  userProgress: {
    questionsCompleted: number;
    currentStreak: number;
    conceptsLearned: string[];
    recentPerformance: {
      avgHintsUsed: number;
      avgAttempts: number;
      avgTimeToComplete: number; // in seconds
    };
  };
  lastQuestion?: {
    id: string;
    concepts: string[];
    difficulty: string;
    wasCorrect: boolean;
    hintsUsed: number;
    attempts: number;
  };
  preferredProvider?: 'claude' | 'openai';
}

interface Question {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  expectedOutputExample?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionRequest = await request.json();
    const { userProgress, lastQuestion, preferredProvider = 'claude' } = body;

    // Generate question using selected LLM provider
    let question: Question;
    
    if (preferredProvider === 'claude') {
      question = await generateQuestionWithClaude(userProgress, lastQuestion);
    } else {
      question = await generateQuestionWithOpenAI(userProgress, lastQuestion);
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}

async function generateQuestionWithClaude(
  userProgress: GenerateQuestionRequest['userProgress'],
  lastQuestion?: GenerateQuestionRequest['lastQuestion']
): Promise<Question> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not found in environment variables');
  }

  const prompt = buildQuestionPrompt(userProgress, lastQuestion);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
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
  const questionText = data.content[0].text;

  return parseQuestionResponse(questionText);
}

async function generateQuestionWithOpenAI(
  userProgress: GenerateQuestionRequest['userProgress'],
  lastQuestion?: GenerateQuestionRequest['lastQuestion']
): Promise<Question> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  const prompt = buildQuestionPrompt(userProgress, lastQuestion);

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
      max_tokens: 1000,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const questionText = data.choices[0].message.content;

  return parseQuestionResponse(questionText);
}

function buildQuestionPrompt(
  userProgress: GenerateQuestionRequest['userProgress'],
  lastQuestion?: GenerateQuestionRequest['lastQuestion']
): string {
  // Initialize Bolt Foundry client
  const bf = BfClient.create();

  // Determine appropriate difficulty and concepts based on user progress
  const difficulty = getDifficultyLevel(userProgress, lastQuestion);
  const focusConcepts = getNextConcepts(userProgress, lastQuestion);

  // Create assistant card
  
  
  return `You are a JavaScript tutor creating practical, real-world coding questions. 

User Progress Context:
- Questions completed: ${userProgress.questionsCompleted}
- Current streak: ${userProgress.currentStreak}
- Concepts learned: ${userProgress.conceptsLearned.join(', ') || 'None yet'}
- Average hints needed: ${userProgress.recentPerformance.avgHintsUsed}
- Average attempts: ${userProgress.recentPerformance.avgAttempts}

${lastQuestion ? `
Last Question Context:
- Concepts: ${lastQuestion.concepts.join(', ')}
- Difficulty: ${lastQuestion.difficulty}
- Was correct: ${lastQuestion.wasCorrect}
- Hints used: ${lastQuestion.hintsUsed}
- Attempts: ${lastQuestion.attempts}
` : ''}

Generate a JavaScript coding question with these requirements:

1. **Difficulty**: ${difficulty}
2. **Focus Concepts**: ${focusConcepts.join(', ')}
3. **Style**: Practical, real-world scenarios (NO computer science theory, binary trees, linked lists, etc.)
4. **Format**: Function that the user needs to complete
5. **Scope**: Should take 2-5 minutes for someone at this level

IMPORTANT EXECUTION FORMAT:
- ALWAYS use console.log(functionName(params)) in both starter code and solution
- This ensures consistent output display for all questions
- Students will see the output directly when they run their code

Please respond with ONLY a JSON object in this exact format (ensure all newlines are escaped as \\n):
{
  "id": "unique_id_here",
  "title": "Clear, engaging title",
  "description": "Detailed problem description with context and requirements",
  "starterCode": "function name(params) {\\n  // Your code here\\n}\\n\\nconsole.log(name(example));",
  "solution": "Complete working solution",
  "difficulty": "${difficulty}",
  "concepts": ["concept1", "concept2"],
  "expectedOutputExample": "What the console should show when run"
}

IMPORTANT: 
- All string values containing newlines must escape them as \\n for valid JSON
- ALWAYS use console.log(functionName()) format in starter code and solution
- This creates consistent behavior across all questions

Make it engaging and practical - something they might actually use in real web development!`;
}

function getDifficultyLevel(
  userProgress: GenerateQuestionRequest['userProgress'],
  lastQuestion?: GenerateQuestionRequest['lastQuestion']
): 'beginner' | 'intermediate' | 'advanced' {
  const { questionsCompleted, currentStreak, recentPerformance } = userProgress;
  
  // If they struggled with the last question, stay at same level or go easier
  if (lastQuestion && (!lastQuestion.wasCorrect || lastQuestion.hintsUsed > 2)) {
    if (lastQuestion.difficulty === 'intermediate') return 'beginner';
    if (lastQuestion.difficulty === 'advanced') return 'intermediate';
    return 'beginner';
  }
  
  // If they're doing well, consider advancing
  if (currentStreak >= 3 && recentPerformance.avgHintsUsed < 1.5) {
    if (questionsCompleted < 5) return 'beginner';
    if (questionsCompleted < 15) return 'intermediate';
    return 'advanced';
  }
  
  // Default progression
  if (questionsCompleted < 3) return 'beginner';
  if (questionsCompleted < 10) return 'beginner';
  if (questionsCompleted < 20) return 'intermediate';
  return 'advanced';
}

function getNextConcepts(
  userProgress: GenerateQuestionRequest['userProgress'],
  lastQuestion?: GenerateQuestionRequest['lastQuestion']
): string[] {
  const allConcepts = [
    // Beginner concepts
    'variables', 'functions', 'console.log', 'basic syntax', 'parameters',
    'return values', 'string manipulation', 'numbers and math',
    
    // Intermediate concepts  
    'if statements', 'comparison operators', 'logical operators',
    'arrays', 'loops', 'objects', 'array methods',
    
    // Advanced concepts
    'arrow functions', 'destructuring', 'template literals',
    'async/await', 'promises', 'error handling', 'modules'
  ];
  
  const learned = userProgress.conceptsLearned;
  
  // If last question was wrong, reinforce those concepts
  if (lastQuestion && !lastQuestion.wasCorrect) {
    return lastQuestion.concepts;
  }
  
  // Otherwise, pick new concepts they haven't learned yet
  const unlearned = allConcepts.filter(concept => !learned.includes(concept));
  
  if (unlearned.length === 0) {
    // They've learned everything, mix concepts
    return [learned[Math.floor(Math.random() * learned.length)], 
            learned[Math.floor(Math.random() * learned.length)]];
  }
  
  // Return 1-2 new concepts
  return unlearned.slice(0, Math.random() < 0.7 ? 1 : 2);
}

function parseQuestionResponse(responseText: string): Question {
  try {
    // Clean up the response text to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    // Fix common JSON formatting issues from LLM responses
    let jsonText = jsonMatch[0];
    
    // Replace literal newlines in string values with \n
    jsonText = jsonText.replace(/"([^"]*)"(\s*:\s*)"([^"]*(?:\\.[^"]*)*?)"/g, (match, key, colon, value) => {
      // Only fix newlines in string values, not keys
      if (colon.includes(':')) {
        const fixedValue = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        return `"${key}"${colon}"${fixedValue}"`;
      }
      return match;
    });
    
    const parsed = JSON.parse(jsonText);
    
    // Validate required fields
    const required = ['id', 'title', 'description', 'starterCode', 'solution', 'difficulty', 'concepts'];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return parsed as Question;
  } catch (error) {
    console.error('Error parsing question response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse LLM response');
  }
}