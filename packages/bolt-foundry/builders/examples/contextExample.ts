// deno-lint-ignore-file no-console
import { BfClient } from "../../BfClient.ts";

// Create a customer support deck with context variables
export function createCustomerSupportDeck() {
  const client = BfClient.create();

  return client.createDeck(
    "customer-support-agent",
    (b) =>
      b.card(
        "role",
        (c) =>
          c.spec("You are a professional customer support agent")
            .spec("You help resolve customer issues efficiently")
            .spec("You maintain a friendly and empathetic tone"),
      )
        .card(
          "behavior",
          (c) =>
            c.spec("Listen actively to understand the customer's problem")
              .spec("Provide clear and actionable solutions")
              .spec("Escalate to supervisor when needed"),
        )
        .context((c) =>
          c.string("customerName", "What is the customer's name?")
            .string("accountId", "What is the customer's account ID?")
            .string(
              "issueType",
              "What type of issue is the customer experiencing?",
            )
            .boolean("isPriority", "Is this a priority customer?")
            .object(
              "previousInteractions",
              "What were the previous interactions with this customer?",
            )
        ),
  );
}

// Example usage
function demonstrateContextUsage() {
  const deck = createCustomerSupportDeck();

  // Render with full context
  const fullContext = deck.render({
    model: "gpt-4",
    temperature: 0.7,
    context: {
      customerName: "Sarah Johnson",
      accountId: "ACC-12345",
      issueType: "billing discrepancy",
      isPriority: true,
      previousInteractions: {
        lastContact: "2024-01-15",
        resolvedIssues: ["password reset", "shipping delay"],
        satisfaction: "high",
      },
    },
  });

  console.log("Full context messages:", fullContext.messages);

  // Render with partial context (some variables omitted)
  const partialContext = deck.render({
    model: "gpt-4",
    context: {
      customerName: "John Doe",
      issueType: "technical support",
      // isPriority and previousInteractions are omitted
    },
  });

  console.log("Partial context messages:", partialContext.messages);
}

// Create a personalized learning assistant
export function createLearningAssistant() {
  const client = BfClient.create();

  return client.createDeck(
    "personalized-tutor",
    (b) =>
      b.spec("You are an adaptive learning assistant")
        .spec("Adjust your teaching style based on the student's level")
        .spec("Provide examples and exercises appropriate to their knowledge")
        .context((c) =>
          c.string("studentName", "What is the student's name?")
            .string("subject", "What subject are we learning?")
            .number("gradeLevel", "What grade level is the student in?")
            .string(
              "learningStyle",
              "What is the student's preferred learning style?",
            )
            .object("strengths", "What are the student's academic strengths?")
            .object(
              "challenges",
              "What areas does the student find challenging?",
            )
        ),
  );
}

// Example: Dynamic context based on user session
export function createSessionAwareAssistant() {
  const client = BfClient.create();

  const deck = client.createDeck(
    "session-assistant",
    (b) =>
      b.spec("You are a context-aware assistant")
        .spec("Remember information from our conversation")
        .context((c) =>
          c.string("userName", "What is the user's name?")
            .object("sessionData", "What is the current session information?")
            .boolean("returningUser", "Is this a returning user?")
        ),
  );

  // Simulate different session states
  const newUserSession = deck.render({
    context: {
      userName: "Alex",
      sessionData: {
        startTime: new Date().toISOString(),
        device: "mobile",
        location: "San Francisco",
      },
      returningUser: false,
    },
  });

  const returningUserSession = deck.render({
    context: {
      userName: "Morgan",
      sessionData: {
        startTime: new Date().toISOString(),
        lastVisit: "2024-01-20",
        totalSessions: 15,
        preferences: {
          theme: "dark",
          language: "en",
          notifications: true,
        },
      },
      returningUser: true,
    },
  });

  return { deck, newUserSession, returningUserSession };
}

// Run demonstrations if this file is executed directly
if (import.meta.main) {
  console.log("=== Customer Support Deck Example ===");
  demonstrateContextUsage();

  console.log("\n=== Learning Assistant Example ===");
  const tutor = createLearningAssistant();
  const tutorSession = tutor.render({
    context: {
      studentName: "Emma",
      subject: "Mathematics",
      gradeLevel: 8,
      learningStyle: "visual",
      strengths: {
        areas: ["geometry", "basic algebra"],
        testScores: { geometry: 92, algebra: 88 },
      },
      challenges: {
        areas: ["word problems", "fractions"],
        commonErrors: ["unit conversion", "decimal operations"],
      },
    },
  });
  console.log("Tutor messages:", tutorSession.messages);
}
