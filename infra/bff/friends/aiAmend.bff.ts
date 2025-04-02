// infra/bff/friends/aiAmend.bff.ts
import { register } from "infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { connectToOpenAi } from "packages/bolt-foundry/bolt-foundry.ts";

const logger = getLogger(import.meta);

export async function aiAmend(_args: string[]): Promise<number> {
  logger.info(
    "Running aiAmend to amend previous commit with AI-generated message...",
  );

  // First, run format to ensure code is properly formatted
  logger.info("Running code formatter first...");
  const formatResult = await runShellCommand(["bff", "f"]);
  if (formatResult !== 0) {
    logger.warn("Formatting encountered issues, but continuing with amend...");
  }

  // Run linting
  logger.info("Running linter...");
  const lintResult = await runShellCommand(["bff", "lint"]);
  if (lintResult !== 0) {
    logger.error(
      "Linting failed. Please fix the linting issues before amending commit.",
    );
    return lintResult;
  }

  // Run type checking
  logger.info("Running type checker...");
  const checkResult = await runShellCommand(["bff", "check"]);
  if (checkResult !== 0) {
    logger.error(
      "Type checking failed. Please fix the type errors before amending commit.",
    );
    return checkResult;
  }

  // Check for OpenAI API key
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  const posthogApiKey = Deno.env.get("POSTHOG_API_KEY") || "dummy-key";

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

  // 1. Get the current commit message
  logger.info("1. Getting current commit message");
  const { stdout: currentCommitMessage, code: commitMsgCode } =
    await runShellCommandWithOutput(
      ["sl", "log", "-r", ".", "--template", "{desc}"],
      {},
      true,
      true,
    );

  if (commitMsgCode !== 0) {
    logger.error("Failed to get current commit message");
    return commitMsgCode;
  }

  logger.info("Current commit message:");
  logger.info(currentCommitMessage);

  // 2. Track all uncommitted changes with sl add and sl remove
  logger.info("2. Tracking any uncommitted changes with sl add and sl remove");

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

  // 3. Get the diff from the current commit
  logger.info("3. Generating diff for the current commit");
  const { stdout: commitDiff, code: commitDiffCode } =
    await runShellCommandWithOutput(
      ["sl", "diff", "-c", "."],
      {},
      true,
      true,
    );

  if (commitDiffCode !== 0) {
    logger.error("Failed to generate diff for current commit");
    return commitDiffCode;
  }

  // 4. Get diff for any uncommitted changes
  logger.info("4. Generating diff for uncommitted changes");
  const { stdout: uncommittedDiff, code: uncommittedDiffCode } =
    await runShellCommandWithOutput(
      ["sl", "diff"],
      {},
      true,
      true,
    );

  if (uncommittedDiffCode !== 0) {
    logger.error("Failed to generate diff for uncommitted changes");
    return uncommittedDiffCode;
  }

  // 5. Combine the diffs to get a complete picture of all changes
  const combinedDiff = commitDiff +
    (uncommittedDiff.trim()
      ? "\n\n/* Uncommitted Changes */\n" + uncommittedDiff
      : "");

  if (!combinedDiff.trim()) {
    logger.warn("No changes detected in combined diff");
    return 0;
  }

  // 6. Connect to OpenAI and create a custom fetch
  const openAiFetch = connectToOpenAi(openaiApiKey, posthogApiKey);

  // 7. Prepare the prompt to send to OpenAI
  const prompt = `
I need you to analyze the following git diff and the existing commit message, then create:
1. A concise but descriptive commit title (one line, max 72 chars)
2. A detailed commit message that explains what changed and why
3. A brief test plan section

Take into account the existing commit message when generating the new one.

Format your response EXACTLY like this, with no extra text:
TITLE: <commit title>

SUMMARY:
<summary of changes>

TEST PLAN:
<test plan>

Here is the existing commit message:
${currentCommitMessage}

Here is the combined diff (including both committed and uncommitted changes):
${combinedDiff}
`;

  // 8. Send to OpenAI and get response
  logger.info("5. Sending combined diff to OpenAI...");
  try {
    const response = await openAiFetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
      },
    );

    const result = await response.json();
    const aiResponse = result.choices[0].message.content.trim();

    // 9. Parse response into title and message
    const titleMatch = aiResponse.match(/TITLE: (.*)/);
    const title = titleMatch ? titleMatch[1].trim() : "Automated commit";

    // Extract everything after TITLE line for the commit message
    const message = aiResponse.replace(/TITLE: .*\n/, "").trim();

    // 10. Display the generated commit message
    logger.info("6. OpenAI generated the following commit message:");
    logger.info(`\n${title}\n\n${message}`);

    // 11. Ask user if they want to amend with this message
    logger.info("\n7. Do you want to amend with this message? (y/n)");

    const decoder = new TextDecoder();
    const buffer = new Uint8Array(1);
    await Deno.stdin.read(buffer);
    const answer = decoder.decode(buffer).toLowerCase();

    if (answer === "y") {
      // 12. Amend the commit, including any uncommitted changes
      logger.info("8. Amending commit...");
      // Ensure proper escaping of the commit message
      const amendResult = await runShellCommand([
        "sl",
        "commit",
        "--amend",
        "-m",
        title + "\n\n" + message,
      ]);

      if (amendResult !== 0) {
        logger.error("Failed to amend commit");
        return amendResult;
      }

      logger.info("Commit amended successfully!");

      // Ask if user wants to submit a pull request
      logger.info("\n9. Do you want to submit a pull request? (y/n)");
      await Deno.stdin.read(buffer);
      const submitPrAnswer = decoder.decode(buffer).toLowerCase();

      if (submitPrAnswer === "y") {
        logger.info("10. Submitting pull request...");
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
      logger.info("Amend cancelled.");
      return 0;
    }
  } catch (error) {
    logger.error("Error communicating with OpenAI:", error);
    return 1;
  }
}

register(
  "aiAmend",
  "Amend previous commit with an AI-generated message based on the commit's changes",
  aiAmend,
);
