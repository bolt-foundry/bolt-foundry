import { NextRequest, NextResponse } from "next/server";
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
  preferredProvider?: "claude" | "openai";
}

interface Question {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  concepts: string[];
  expectedOutputExample?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionRequest = await request.json();
    const { userProgress, lastQuestion, preferredProvider = "claude" } = body;

    // Generate question using selected LLM provider
    let question: Question;

    if (preferredProvider === "claude") {
      question = await generateQuestionWithClaude(userProgress, lastQuestion);
    } else {
      question = await generateQuestionWithOpenAI(userProgress, lastQuestion);
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 },
    );
  }
}

async function generateQuestionWithClaude(
  userProgress: GenerateQuestionRequest["userProgress"],
  lastQuestion?: GenerateQuestionRequest["lastQuestion"],
): Promise<Question> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not found in environment variables");
  }

  const assistantCard = getAssistantCard(userProgress, lastQuestion);
  const cardData = assistantCard.assistant.render({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "",
      },
    ],
    context: assistantCard.contextData,
  });

  const response = await fetch(
    "https://api.anthropic.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(cardData),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Claude API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const questionText = data.choices[0].message.content;

  return parseQuestionResponse(questionText);
}

async function generateQuestionWithOpenAI(
  userProgress: GenerateQuestionRequest["userProgress"],
  lastQuestion?: GenerateQuestionRequest["lastQuestion"],
): Promise<Question> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not found in environment variables");
  }

  const assistantCard = getAssistantCard(userProgress, lastQuestion);
  const cardData = assistantCard.assistant.render({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "",
      },
    ],
    max_tokens: 1000,
    temperature: 0.7,
    context: assistantCard?.contextData,
  });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(cardData),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const questionText = data.choices[0].message.content;

  return parseQuestionResponse(questionText);
}

function getAssistantCard(
  userProgress: GenerateQuestionRequest["userProgress"],
  lastQuestion?: GenerateQuestionRequest["lastQuestion"],
): string {
  // Initialize Bolt Foundry client
  const bf = BfClient.create();

  // Determine appropriate difficulty and concepts based on user progress
  const difficulty = getDifficultyLevel(userProgress, lastQuestion);
  const focusConcepts = getNextConcepts(userProgress, lastQuestion);

  // Create assistant card for JavaScript tutor
  const assistant = bf.createAssistantCard("javascript-tutor", (card) =>
    card
      .spec(
        "You are a JavaScript tutor creating practical, real-world coding questions",
      )
      .spec(
        "Focus on exercises that take 2-5 minutes for someone at the target level",
      )
      .spec(
        "Use practical scenarios, NOT computer science theory like binary trees or linked lists",
      )
      .spec(
        "Always create function-based exercises where students complete missing functionality",
      )
      .spec(
        "ALWAYS use console.log(functionName(params)) in both starter code and solution",
      )
      .specs("Behaviors", (behavior) => (
        behavior
          .spec(
            "Ensure all questions are engaging and practical for real web development",
          )
          .spec("Return ONLY a JSON object with no additional text")
          .spec("Escape all newlines in JSON string values as \\n")
          .spec("Include console.log() calls for immediate output feedback")
          .spec("Use the exact JSON format specified", {
            // samples: [{
            //   input: {
            //     text: "Generate a beginner JavaScript question about variables",
            //     context: "Sample request for question generation"
            //   },
            //   responses: [{
            //     text: `{
            // "id": "var-basics-1",
            // "title": "Create a greeting message",
            // "description": "Write a function that takes a name and returns a personalized greeting",
            // "starterCode": "function greetUser(name) {\\n  // Your code here\\n}\\n\\nconsole.log(greetUser('Alice'));",
            // "solution": "function greetUser(name) {\\n  return 'Hello, ' + name + '!';\\n}\\n\\nconsole.log(greetUser('Alice'));",
            // "difficulty": "beginner",
            // "concepts": ["variables", "functions", "string manipulation"],
            // "expectedOutputExample": "Hello, Alice!"
            // }`,
            //     rating: 3,
            //     explanation: "Perfect JSON format with escaped newlines and console.log usage"
            //   }]
            // }]
          })
      ))
      .context((ctx) =>
        ctx
          .string(
            "difficulty",
            "What is the target difficulty level for the question?",
          )
          .string(
            "focusConcepts",
            "What concepts should we focus on, separated by commas?",
          )
          .number(
            "questionsCompleted",
            "How many questions has the user completed?",
          )
          .number(
            "currentStreak",
            "What's the current streak of correct answers?",
          )
          .string(
            "conceptsLearned",
            "Which concepts has the user already learned?",
          )
          .number(
            "avgHintsUsed",
            "On average, how many hints have been used recently?",
          )
          .number(
            "avgAttempts",
            "On average, how many attempts have been needed recently?",
          )
      )
      .context((ctx) =>
        ctx
          .string(
            "lastQuestionConcepts",
            "What were the concepts from the last question?",
          )
          .string(
            "lastQuestionDifficulty",
            "What was the difficulty of the last question?",
          )
          .boolean(
            "lastQuestionWasCorrect",
            "Was the last question answered correctly?",
          )
          .number(
            "lastQuestionHintsUsed",
            "How many hints were used for the last question?",
          )
          .number(
            "lastQuestionAttempts",
            "How many attempts were made for the last question?",
          )
          .string(
            "jsonFormat",
            "What is the exact JSON format for the question object?",
          )
      ));

  // Prepare context data
  const userContextData = {
    difficulty,
    focusConcepts: focusConcepts.join(", "),
    questionsCompleted: userProgress.questionsCompleted,
    currentStreak: userProgress.currentStreak,
    conceptsLearned: userProgress.conceptsLearned.join(", ") || "None yet",
    avgHintsUsed: userProgress.recentPerformance.avgHintsUsed,
    avgAttempts: userProgress.recentPerformance.avgAttempts,
  };

  const lastQuestionContextData = {
    lastQuestionConcepts: lastQuestion?.concepts.join(", ") || "None",
    lastQuestionDifficulty: lastQuestion?.difficulty || "None",
    lastQuestionWasCorrect: lastQuestion?.wasCorrect || false,
    lastQuestionHintsUsed: lastQuestion?.hintsUsed || 0,
    lastQuestionAttempts: lastQuestion?.attempts || 0,
    jsonFormat: `{
"id": "unique_id _here",
"title": "Clear, engaging title",
"description": "Write a function that returns [expected output]. The function will be called and its result will be displayed automatically.",
"starterCode": "function name(params) {\\n // Your code herel\n // Remember to return the result\\n\\n\\n// Test calls (results will be shown automatically) \ \nname( example
); "
"solution": "Complete working solution that RETURNS the result",
"difficulty": "beginner",
"concepts": ["concept1", "concept2"],
"expectedOutputExample": "What the console should show when run"
}`,
  };

  const contextData = { ...userContextData, ...lastQuestionContextData };

  return { assistant, contextData };
}

function getDifficultyLevel(
  userProgress: GenerateQuestionRequest["userProgress"],
  lastQuestion?: GenerateQuestionRequest["lastQuestion"],
): "beginner" | "intermediate" | "advanced" {
  const { questionsCompleted, currentStreak, recentPerformance } = userProgress;

  // If they struggled with the last question, stay at same level or go easier
  if (
    lastQuestion && (!lastQuestion.wasCorrect || lastQuestion.hintsUsed > 2)
  ) {
    if (lastQuestion.difficulty === "intermediate") return "beginner";
    if (lastQuestion.difficulty === "advanced") return "intermediate";
    return "beginner";
  }

  // If they're doing well, consider advancing
  if (currentStreak >= 3 && recentPerformance.avgHintsUsed < 1.5) {
    if (questionsCompleted < 5) return "beginner";
    if (questionsCompleted < 15) return "intermediate";
    return "advanced";
  }

  // Default progression
  if (questionsCompleted < 3) return "beginner";
  if (questionsCompleted < 10) return "beginner";
  if (questionsCompleted < 20) return "intermediate";
  return "advanced";
}

function getNextConcepts(
  userProgress: GenerateQuestionRequest["userProgress"],
  lastQuestion?: GenerateQuestionRequest["lastQuestion"],
): string[] {
  const allConcepts = [
    // Beginner concepts
    "variables",
    "functions",
    "console.log",
    "basic syntax",
    "parameters",
    "return values",
    "string manipulation",
    "numbers and math",

    // Intermediate concepts
    "if statements",
    "comparison operators",
    "logical operators",
    "arrays",
    "loops",
    "objects",
    "array methods",

    // Advanced concepts
    "arrow functions",
    "destructuring",
    "template literals",
    "async/await",
    "promises",
    "error handling",
    "modules",
  ];

  const learned = userProgress.conceptsLearned;

  // If last question was wrong, reinforce those concepts
  if (lastQuestion && !lastQuestion.wasCorrect) {
    return lastQuestion.concepts;
  }

  // Otherwise, pick new concepts they haven't learned yet
  const unlearned = allConcepts.filter((concept) => !learned.includes(concept));

  if (unlearned.length === 0) {
    // They've learned everything, mix concepts
    return [
      learned[Math.floor(Math.random() * learned.length)],
      learned[Math.floor(Math.random() * learned.length)],
    ];
  }

  // Return 1-2 new concepts
  return unlearned.slice(0, Math.random() < 0.7 ? 1 : 2);
}

function parseQuestionResponse(responseText: string): Question {
  try {
    // Clean up the response text to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    // Fix common JSON formatting issues from LLM responses
    let jsonText = jsonMatch[0];

    // Replace literal newlines in string values with \n
    jsonText = jsonText.replace(
      /"([^"]*)"(\s*:\s*)"([^"]*(?:\\.[^"]*)*?)"/g,
      (match, key, colon, value) => {
        // Only fix newlines in string values, not keys
        if (colon.includes(":")) {
          const fixedValue = value.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
          return `"${key}"${colon}"${fixedValue}"`;
        }
        return match;
      },
    );

    const parsed = JSON.parse(jsonText);

    // Validate required fields
    const required = [
      "id",
      "title",
      "description",
      "starterCode",
      "solution",
      "difficulty",
      "concepts",
    ];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return parsed as Question;
  } catch (error) {
    console.error("Error parsing question response:", error);
    console.error("Response text:", responseText);
    throw new Error("Failed to parse LLM response");
  }
}
