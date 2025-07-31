/**
 * Terminal titlebar update utilities.
 *
 * Provides functions to update the terminal title bar using ANSI escape sequences.
 * Works with terminals that support OSC (Operating System Command) sequences.
 */

/** ANSI escape sequence to set terminal title */
const TITLE_START = "\x1b]0;";
const TITLE_END = "\x07";

/**
 * Update the terminal titlebar with the given title.
 *
 * @param title - The title to set
 * @returns Promise that resolves when the title is written
 *
 * @example
 * ```ts
 * await updateTitlebar("My App - Working...");
 * ```
 */
export async function updateTitlebar(title: string): Promise<void> {
  try {
    await Deno.stdout.write(
      new TextEncoder().encode(`${TITLE_START}${title}${TITLE_END}`),
    );
  } catch {
    // Ignore errors if not running in a terminal that supports title updates
  }
}

/**
 * Clear the terminal titlebar (reset to default).
 *
 * @returns Promise that resolves when the title is cleared
 */
export async function clearTitlebar(): Promise<void> {
  await updateTitlebar("");
}

/**
 * Create a titlebar updater with a prefix.
 *
 * @param prefix - The prefix to prepend to all titles
 * @returns Object with update and clear methods
 *
 * @example
 * ```ts
 * const titlebar = createTitlebarUpdater("MyApp");
 * await titlebar.update("Loading...");  // Sets title to "MyApp: Loading..."
 * ```
 */
export function createTitlebarUpdater(prefix: string) {
  return {
    update: (suffix: string) => updateTitlebar(`${prefix}: ${suffix}`),
    clear: () => clearTitlebar(),
  };
}

/**
 * Check if the current environment supports terminal title updates.
 *
 * @returns true if running in a TTY that likely supports title updates
 */
export function supportsTitlebar(): boolean {
  // Check for FORCE_TITLEBAR environment variable
  if (Deno.env.get("FORCE_TITLEBAR") === "1") {
    return true;
  }

  // Check for NO_TITLEBAR environment variable
  if (Deno.env.get("NO_TITLEBAR") === "1") {
    return false;
  }

  // Check for known terminal types that support title updates
  const term = Deno.env.get("TERM") || "";
  const termProgram = Deno.env.get("TERM_PROGRAM") || "";

  // List of terminals known to support title updates
  const supportedTerms = [
    "xterm",
    "rxvt",
    "screen",
    "tmux",
    "alacritty",
    "kitty",
    "wezterm",
    "ghostty",
  ];

  const supportedPrograms = [
    "iTerm.app",
    "Terminal.app",
    "Hyper",
    "vscode",
    "Apple_Terminal",
  ];

  // If we have a supported TERM or TERM_PROGRAM, assume it works
  // even if isTerminal() returns false (e.g., when piped)
  return supportedTerms.some((t) => term.includes(t)) ||
    supportedPrograms.some((p) => termProgram.includes(p));
}
