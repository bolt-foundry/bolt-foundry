#! /usr/bin/env -S bff

import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { startSpinner } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

register("remote:list", "list all currently mounted directories", async () => {
  startSpinner();
  const bfPath = getConfigurationVariable("PWD");
  if (!bfPath) {
    logger.error("BF_PATH is not set");
    return 1;
  }

  const command = new Deno.Command("mount", {
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  // Log the raw output for debugging
  // logger.debug("Mount command output:", output);

  // Use a regular expression to accurately parse the mount lines
  const mountLines = output.split("\n").filter((line) =>
    line.includes("fuse-t") && line.includes(bfPath)
  );

  const mounts = mountLines.map((line) => {
    // Match lines like: source on mountPoint (type) options
    const match = line.match(/^(.+?) on (.+?) \((.+?)\)$/);
    if (match) {
      const [, source, mountPoint] = match;
      return { source, mountPoint };
    }
    return null;
  }).filter((mount) => mount !== null);

  if (mounts.length === 0) {
    logger.info("No SSHFS mounts found under BF_PATH");
    return 0;
  }

  logger.info("Current SSHFS mounts:");
  mounts.forEach(({ source, mountPoint }) => {
    logger.info(`${source} -> ${mountPoint}`);
  });

  return 0;
});

register(
  "remote:unmount",
  "unmount all or specific SSHFS directories",
  async ([dirName]) => {
    startSpinner();
    const bfPath = getConfigurationVariable("PWD");
    if (!bfPath) {
      logger.error("BF_PATH is not set");
      return 1;
    }

    const mountCmd = new Deno.Command("mount", {
      stdout: "piped",
      stderr: "piped",
    });

    const { stdout } = await mountCmd.output();
    const output = new TextDecoder().decode(stdout);

    const mounts = output
      .split("\n")
      .filter((line) => line.includes("fuse-t") && line.includes(bfPath))
      .map((line) => {
        const [, , mountPoint] = line.split(" ");
        return mountPoint;
      });

    if (mounts.length === 0) {
      logger.info("No SSHFS mounts found");
      return 0;
    }

    const mountsToUnmount = dirName
      ? mounts.filter((mount) => mount.endsWith(dirName))
      : mounts;

    if (mountsToUnmount.length === 0) {
      logger.info(
        `No mounted directory found${dirName ? ` matching ${dirName}` : ""}`,
      );
      return 0;
    }

    for (const mountPoint of mountsToUnmount) {
      try {
        const umountCmd = new Deno.Command("umount", {
          args: ["-f", mountPoint], // Added -f flag here
        });
        const { code, stderr } = await umountCmd.output();

        if (code === 0) {
          logger.info(`Successfully unmounted ${mountPoint}`);
        } else {
          logger.error(
            `Failed to unmount ${mountPoint}: ${
              new TextDecoder().decode(stderr)
            }`,
          );
        }
      } catch (error) {
        logger.error(`Error unmounting ${mountPoint}: ${error}`);
      }
    }

    return 0;
  },
);

const remoteHandler = async ([target, specificFolder]: Array<string>) => {
  startSpinner();
  if (!target) {
    if (getConfigurationVariable("REPL_ID")) {
      logger.info("On your local machine, run:");
      logger.info(
        `bff remote ${getConfigurationVariable("REPL_ID")}@${
          getConfigurationVariable("REPLIT_DEV_DOMAIN")
        }`,
      );
      return 0;
    } else {
      logger.info(
        "Run this in a repl instead and then copy/paste the result.",
      );
      return 1;
    }
  }
  logger.info("Got target:", target);

  const sshfsCheck = new Deno.Command("which", {
    args: ["sshfs"],
    stdout: "piped",
    stderr: "piped",
  });

  const sshCheck = new Deno.Command("ssh", {
    args: ["-T", target],
    stdout: "piped",
    stderr: "piped",
  });

  const { code: sshCode, stderr: sshStderr } = await sshCheck.output();

  if (sshCode !== 0) {
    logger.error(
      `SSH connection to ${target} failed: ${
        new TextDecoder().decode(sshStderr)
      }`,
    );
    return sshCode;
  }

  logger.info(`SSH connection to ${target} successful.`);

  const { code } = await sshfsCheck.output();

  if (code !== 0) {
    logger.info(`Please install SSHFS:
    brew tap macos-fuse-t/homebrew-cask
    brew install fuse-t
    brew install fuse-t-sshfs`);
    return code;
  }

  const bfPath = getConfigurationVariable("PWD");
  const dirsToMount: Array<string> = [];
  const dirsToAvoid: Array<string> = [
    "bin",
    "node_modules",
    "vendor",
    "thirdParty",
    "tmp",
  ];

  if (bfPath) {
    if (specificFolder) {
      if (!dirsToAvoid.includes(specificFolder)) {
        try {
          const stat = await Deno.stat(`${bfPath}/${specificFolder}`);
          if (stat.isDirectory) {
            dirsToMount.push(specificFolder);
          } else {
            logger.error(`${specificFolder} is not a directory`);
            return 1;
          }
        } catch {
          logger.error(`Directory ${specificFolder} not found`);
          return 1;
        }
      } else {
        logger.error(
          `Cannot mount ${specificFolder} - it's in the excluded directories list`,
        );
        return 1;
      }
    } else {
      for await (const dirEntry of Deno.readDir(bfPath)) {
        if (
          dirEntry.isDirectory &&
          !dirEntry.name.startsWith(".") &&
          !dirsToAvoid.includes(dirEntry.name)
        ) {
          dirsToMount.push(dirEntry.name);
        }
      }
    }
  } else {
    logger.error("BF_PATH is not set");
    return 1;
  }

  logger.info("Directories to mount:", dirsToMount);

  // Get the list of currently mounted directories under bfPath
  const mountCmd = new Deno.Command("mount", {
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout: mountStdout } = await mountCmd.output();
  const mountOutput = new TextDecoder().decode(mountStdout);

  const mountLines = mountOutput
    .split("\n")
    .filter((line) => line.includes("fuse-t") && line.includes(bfPath));

  const mountedDirs = mountLines
    .map((line) => {
      // Match lines like: source on mountPoint (type) options
      const match = line.match(/^(.+?) on (.+?) \((.+?)\)$/);
      if (match) {
        const [, , mountPoint] = match;
        // Extract dirName from mountPoint
        const dirName = mountPoint.replace(`${bfPath}/`, "");
        return dirName;
      }
      return null;
    })
    .filter((dirName) => dirName !== null);

  if (mountedDirs.length > 0) {
    logger.info("Already mounted directories:", mountedDirs.join(", "));
  }

  // Remove already mounted directories from dirsToMount
  const dirsToMountFiltered = dirsToMount.filter(
    (dirName) => !mountedDirs.includes(dirName),
  );

  if (dirsToMountFiltered.length === 0) {
    logger.info("All requested directories are already mounted.");
    return 0;
  }

  logger.info("Directories to mount:", dirsToMountFiltered);

  async function mountDirectory(dirName: string) {
    logger.info(`Mounting ${dirName}...`);
    const mountTarget = `${target}:/home/runner/workspace/${dirName}`;
    const localPoint = `${bfPath}/${dirName}`;
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Mount operation for ${dirName} timed out after 30 seconds`,
          ),
        );
      }, 30000);
    });
    const mountPromise = new Deno.Command("sshfs", {
      args: [
        "-o",
        "ServerAliveInterval=15",
        "-o",
        "ServerAliveCountMax=3",
        mountTarget,
        localPoint,
      ],
    }).output();
    try {
      await Promise.race([mountPromise, timeoutPromise]);
      logger.info(`Successfully mounted ${dirName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to mount ${dirName}: ${(error as Error).message}`);
      return false;
    }
  }

  if (dirsToMountFiltered.length > 0) {
    logger.info(
      `Mounting ${dirsToMountFiltered.length} directories...`,
    );

    let successCount = 0;
    let failureCount = 0;

    for (const dirName of dirsToMountFiltered) {
      const result = await mountDirectory(dirName);
      if (result) {
        successCount += 1;
      } else {
        failureCount += 1;
      }
    }

    logger.info(
      `Mount operations completed: ${successCount} succeeded, ${failureCount} failed`,
    );

    return failureCount === 0 ? 0 : 1;
  }

  return 0; // All mounts succeeded
};

// Register both names to the same handler
register("remote", "connect your local computer to a repl", remoteHandler);
register(
  "remote:mount",
  "connect your local computer to a repl (alias for remote)",
  remoteHandler,
);
