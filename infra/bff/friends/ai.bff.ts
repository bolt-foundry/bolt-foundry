// infra/bff/friends/ai.bff.ts
import { register } from "infra/bff/bff.ts";
import {
  runShellCommand,
  runShellCommandWithOutput,
} from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { connectToOpenAi } from "packages/bolt-foundry/bolt-foundry.ts";

const logger = getLogger(import.meta);

async function runPreCommitChecks(): Promise<boolean> {
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
    return false;
  }

  // Run type checking
  logger.info("Running type checker...");
  const checkResult = await runShellCommand(["bff", "check"]);
  if (checkResult !== 0) {
    logger.error(
      "Type checking failed. Please fix the type errors before committing.",
    );
    return false;
  }

  return true;
}

async function configureGitHubUser(): Promise<void> {
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
}

async function trackChanges(): Promise<boolean> {
  // Track all changes with sl add and sl remove
  logger.info("Tracking changes with sl add and sl remove");

  // Run sl add to track all new and modified files
  const addResult = await runShellCommand(["sl", "add", "."]);
  if (addResult !== 0) {
    logger.error("Failed to add files to sapling tracking");
    return false;
  }

  // Run sl remove to track all deleted files
  const removeResult = await runShellCommand(["sl", "remove", "--after"]);
  if (removeResult !== 0) {
    logger.error("Failed to remove deleted files from sapling tracking");
    return false;
  }

  return true;
}

export async function aiCommit(_args: string[]): Promise<number> {
  logger.info("Running ai:commit to generate commit message with OpenAI...");

  // Run initial checks and setup
  if (!await runPreCommitChecks()) return 1;

  // Check for OpenAI API key
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    logger.error("OPENAI_API_KEY environment variable is not set");
    return 1;
  }

  // Configure GitHub user
  await configureGitHubUser();

  // Track all changes
  if (!await trackChanges()) return 1;

  // Generate diff file
  logger.info("Generating diff file");
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

  // Connect to OpenAI and create a custom fetch
  const openAiFetch = connectToOpenAi(openaiApiKey);

  // Prepare the prompt to send to OpenAI
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

  // Send to OpenAI and get response
  logger.info("Sending diff to OpenAI...");
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
    const aiResponse = result.choices[0].message.content.trim();

    // Parse response into title and message
    const titleMatch = aiResponse.match(/TITLE: (.*)/);
    const title = titleMatch ? titleMatch[1].trim() : "Automated commit";

    // Extract everything after TITLE line for the commit message
    const message = aiResponse.replace(/TITLE: .*\n/, "").trim();

    // Display the generated commit message
    logger.info("OpenAI generated the following commit message:");
    logger.info(`\n${title}\n\n${message}`);

    // Ask user if they want to commit with this message
    logger.info("\nDo you want to commit with this message? (y/n)");

    const decoder = new TextDecoder();
    const buffer = new Uint8Array(1);
    await Deno.stdin.read(buffer);
    const answer = decoder.decode(buffer).toLowerCase();

    if (answer === "y") {
      // Create the commit
      logger.info("Creating commit...");
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
      logger.info("\nDo you want to submit a pull request? (y/n)");

      // Create a more robust way to read input
      const submitPrAnswer = await new Promise<string>((resolve) => {
        const buf = new Uint8Array(1);
        Deno.stdin.setRaw(true);
        Deno.stdin.read(buf).then(() => {
          const answer = decoder.decode(buf).toLowerCase();
          Deno.stdin.setRaw(false);
          logger.info(`Input: ${answer}`); // Echo input
          resolve(answer);
        });
      });

      if (submitPrAnswer === "y") {
        logger.info("Submitting pull request...");
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

export async function aiAmend(_args: string[]): Promise<number> {
  logger.info(
    "Running ai:amend to amend previous commit with AI-generated message...",
  );

  // Run initial checks and setup
  if (!await runPreCommitChecks()) return 1;

  // Check for OpenAI API key
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    logger.error("OPENAI_API_KEY environment variable is not set");
    return 1;
  }

  // Configure GitHub user
  await configureGitHubUser();

  // 1. Get the current commit message
  logger.info("Getting current commit message");
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

  // 2. Track all uncommitted changes
  if (!await trackChanges()) return 1;

  // 3. Get the diff from the current commit
  logger.info("Generating diff for the current commit");
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
  logger.info("Generating diff for uncommitted changes");
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
  const openAiFetch = connectToOpenAi(openaiApiKey);

  // 7. Prepare the prompt to send to OpenAI
  const prompt = `
I need you to analyze the following git diff and the existing commit message, then create:
1. A concise but descriptive commit title (one line, max 72 chars)
2. A detailed commit message that explains what changed and why
3. A brief test plan section

Take into account the existing commit message when generating the new one.

Format your response EXACTLY like this, with no extra text:
TITLE: <commit title>

## SUMMARY
<summary of changes>

## TEST PLAN
<test plan>

Here is the existing commit message:
${currentCommitMessage}

Here is the combined diff (including both committed and uncommitted changes):
${combinedDiff}
`;

  // 8. Send to OpenAI and get response
  logger.info("Sending combined diff to OpenAI...");
  try {
    const response = await openAiFetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o", // This will be overridden by bolt-foundry
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
    logger.info("OpenAI generated the following commit message:");
    logger.info(`\n${title}\n\n${message}`);

    // 11. Ask user if they want to amend with this message
    logger.info("\nDo you want to amend with this message? (y/n)");

    const decoder = new TextDecoder();
    const buffer = new Uint8Array(1);
    await Deno.stdin.read(buffer);
    const answer = decoder.decode(buffer).toLowerCase();

    if (answer === "y") {
      // 12. Amend the commit, including any uncommitted changes
      logger.info("Amending commit...");
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
      logger.info("\nDo you want to submit a pull request? (y/n)");

      // Create a more robust way to read input
      const submitPrAnswer = await new Promise<string>((resolve) => {
        const buf = new Uint8Array(1);
        Deno.stdin.setRaw(true);
        Deno.stdin.read(buf).then(() => {
          const answer = decoder.decode(buf).toLowerCase();
          Deno.stdin.setRaw(false);
          logger.info(`Input: ${answer}`); // Echo input
          resolve(answer);
        });
      });

      if (submitPrAnswer === "y") {
        logger.info("Submitting pull request...");
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
  "ai:commit",
  "Generate commit message with OpenAI based on current changes",
  aiCommit,
);

register(
  "ai:amend",
  "Amend previous commit with an AI-generated message based on the commit's changes",
  aiAmend,
);
