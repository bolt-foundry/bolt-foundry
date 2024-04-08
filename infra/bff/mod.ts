#! /usr/bin/env -S deno run -A
type BffCommand = (options: Array<string>) => number | Promise<number>;

type Friend = {
  description: string;
  options: Array<Record<string, string>>;
  command: BffCommand;
};

// Scan the "friends" directory for files that end with ".bff.ts" and import them.

export const friendMap = new Map<string, Friend>();

// Word-wrap function
function wordWrap(str: string, maxWidth: number) {
  return str.replace(
    new RegExp(`(?![^\\n]{1,${maxWidth}}$)([^\\n]{1,${maxWidth}})\\s`, "g"),
    "$1\n",
  );
}

friendMap.set("help", {
  description: "Prints this help message.",
  options: [],
  command: () => {
    let commands = Array.from(friendMap.entries());

    // Sort the commands alphabetically.
    commands = commands.sort((a, b) => a[0].localeCompare(b[0]));

    // Compute the maximum length of command names.
    const longestNameLength = commands.reduce(
      (max, [name]) => Math.max(max, name.length),
      0,
    );

    // deno-lint-ignore no-console
    console.log(`bff: Your bolt foundry best friend forever.

      This is a task runner meant to make it simpler to develop our app and company.

      Usage:
        bff <friend> [options]

      Friends:
        ${
      commands.map(([name, { description }]) =>
        (`${name.padEnd(longestNameLength + 5)} ${description}`).padEnd(80, " ")
      ).join("\n        ")
    }

      ${
      wordWrap(
        `To add a friend, create a file in the "bff/friends" directory that ends with ".bff.ts" and export a function that takes an array of strings as its first argument and a string as its second argument. The first argument is the list of options passed to the friend. The second argument is the current working directory. The function should return a promise that resolves when the friend is done running.\n\n`,
        80,
      )
    }`);
    return 0;
  },
});

export function register(
  name: string,
  description: string,
  command: BffCommand,
  options = [],
) {
  friendMap.set(name, { description, options, command });
}
