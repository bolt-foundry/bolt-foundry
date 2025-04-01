
// infra/bff/friends/aiCommit.bff.ts
import { register } from "infra/bff/bff.ts";
import { runShellCommand, runShellCommandWithOutput } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { connectToOpenAi } from "packages/bolt-foundry/bolt-foundry.ts";

const logger = getLogger(import.meta);

export async function aiCommit(args: string[]): Promise<number> {
  logger.info("Running aiCommit to generate commit message with OpenAI...");

  // Check for OpenAI API key
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  const posthogApiKey = Deno.env.get("POSTHOG_API_KEY") || "dummy-key";
  
  if (!openaiApiKey) {
    logger.error("OPENAI_API_KEY environment variable is not set");
    return 1;
  }

  // 1. Track all changes with sl add and sl remove
  logger.info("1. Tracking changes with sl add and sl remove");
  
  // Run sl add to track all new and modified files
  const addResult = await runShellCommand(["sl", "add", "."]);
  if (addResult !== 0) {
    logger.error("Failed to add files to sapling tracking");
    return addResult;
  }
  
  // Run sl remove to track all deleted files
  const removeResult = await runShellCommand(["sl", "remove", "--after"]);
  if (removeResult !== 0) {
    logger.error("Failed to remove deleted files from sapling tracking");
    return removeResult;
  }
  
  // 2. Generate diff file
  logger.info("2. Generating diff file");
  const { stdout: diffOutput, code: diffCode } = await runShellCommandWithOutput(
    ["sl", "diff"],
    {},
    true,
    true
  );
  
  if (diffCode !== 0) {
    logger.error("Failed to generate diff");
    return diffCode;
  }

  if (!diffOutput.trim()) {
    logger.warn("No changes detected in diff");
    return 0;
  }

  // 3. Connect to OpenAI and create a custom fetch
  const openAiFetch = connectToOpenAi(openaiApiKey, posthogApiKey);

  // 4. Prepare the prompt to send to OpenAI
  const prompt = `
I need you to analyze the following git diff and create:
1. A concise but descriptive commit title (one line, max 72 chars)
2. A detailed commit message that explains what changed and why
3. A brief test plan section

Format your response EXACTLY like this, with no extra text:
TITLE: <commit title>

SUMMARY:
<summary of changes>

TEST PLAN:
<test plan>

Here is the diff:
${diffOutput}
`;

  // 5. Send to OpenAI and get response
  logger.info("3. Sending diff to OpenAI...");
  try {
    const response = await openAiFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // This will be overridden by bolt-foundry
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const result = await response.json();
    const aiResponse = result.choices[0].message.content.trim();
    
    // 6. Parse response into title and message
    const titleMatch = aiResponse.match(/TITLE: (.*)/);
    const title = titleMatch ? titleMatch[1].trim() : "Automated commit";
    
    // Extract everything after TITLE line for the commit message
    const message = aiResponse.replace(/TITLE: .*\n/, "").trim();

    // 7. Display the generated commit message
    logger.info("4. OpenAI generated the following commit message:");
    logger.info(`\n${title}\n\n${message}`);

    // 8. Ask user if they want to commit with this message
    logger.info("\n5. Do you want to commit with this message? (y/n)");
    
    const decoder = new TextDecoder();
    const buffer = new Uint8Array(1);
    await Deno.stdin.read(buffer);
    const answer = decoder.decode(buffer).toLowerCase();

    if (answer === "y") {
      // 9. Create the commit
      logger.info("6. Creating commit...");
      const commitResult = await runShellCommand([
        "sl",
        "commit",
        "-m",
        `${title}\n\n${message}`,
      ]);
      
      if (commitResult !== 0) {
        logger.error("Failed to create commit");
        return commitResult;
      }
      
      logger.info("Commit created successfully!");
      return 0;
    } else {
      logger.info("Commit cancelled.");
      return 0;
    }
  } catch (error) {
    logger.error("Error communicating with OpenAI:", error);
    return 1;
  }
}

register(
  "aiCommit",
  "Generate commit message with OpenAI based on current changes",
  aiCommit,
);
