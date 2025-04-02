// infra/bff/friends/aiCommit.bff.ts
import { register } from "infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { connectToOpenAi } from "packages/bolt-foundry/bolt-foundry.ts";

const logger = getLogger(import.meta);

export async function aiCommit(_args: string[]): Promise<number> {
  logger.info("Running aiCommit to generate commit message with OpenAI...");

  // First, run format to ensure code is properly formatted
  logger.info("Running code formatter first...");
  const formatResult = await runShellCommand(["bff", "f"]);
  if (formatResult !== 0) {
    logger.warn("Formatting encountered issues, but continuing with commit...");
  }

  // Run linting
  logger.info("Running linter...");
  const lintResult = await runShellCommand(["bff", "lint"]);
  if (lintResult !== 0) {
    logger.error(
      "Linting failed. Please fix the linting issues before committing.",
    );
    return lintResult;
  }

  // Run type checking
  logger.info("Running type checker...");
  const checkResult = await runShellCommand(["bff", "check"]);
  if (checkResult !== 0) {
    logger.error(
      "Type checking failed. Please fix the type errors before committing.",
    );
    return checkResult;
  }

  // Check for OpenAI API key
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openaiApiKey) {
    logger.error("OPENAI_API_KEY environment variable is not set");
    return 1;
  }

  // Try to get and configure GitHub user info
  try {
    logger.info("Checking GitHub user information...");
    const { stdout: userInfoJson, code: userInfoCode } =
      await runShellCommandWithOutput(
        ["gh", "api", "user"],
        {},
        true,
        true,
      );

    if (userInfoCode === 0 && userInfoJson) {
      const userInfo = JSON.parse(userInfoJson);
      const username = userInfo.login;
      const name = userInfo.name || username;
      const email = userInfo.email || `${username}@users.noreply.github.com`;

      logger.info(`Found GitHub user: ${name} <${email}>`);

      // Configure Sapling with the user info
      const configResult = await runShellCommand([
        "sl",
        "config",
        "--user",
        "ui.username",
        `${name} <${email}>`,
      ]);

      if (configResult === 0) {
        logger.info("Successfully configured Sapling with GitHub user info");
      } else {
        logger.warn("Failed to configure Sapling with GitHub user info");
      }
    }
  } catch (error) {
    logger.warn("Could not retrieve GitHub user info:", error);
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
  const { stdout: diffOutput, code: diffCode } =
    await runShellCommandWithOutput(
      ["sl", "diff"],
      {},
      true,
      true,
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
  const openAiFetch = connectToOpenAi(openaiApiKey);

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
    const response = await openAiFetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      },
    );

    const result = await response.json();
    logger.info(result);
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

      // Ask if user wants to submit a pull request
      logger.info("\n7. Do you want to submit a pull request? (y/n)");
      await Deno.stdin.read(buffer);
      const submitPrAnswer = decoder.decode(buffer).toLowerCase();

      if (submitPrAnswer === "y") {
        logger.info("8. Submitting pull request...");
        const submitResult = await runShellCommand([
          "sl",
          "submit",
        ]);

        if (submitResult !== 0) {
          logger.error("Failed to submit pull request");
          return submitResult;
        }

        logger.info("Pull request submitted successfully!");
      } else {
        logger.info("Pull request submission skipped.");
      }

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
