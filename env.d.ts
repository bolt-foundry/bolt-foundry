// Deno types are included by default

declare namespace Deno {
  export interface Env {
    // OpenAI Configuration
    OPENAI_API_KEY?: string;

    // Database Configuration
    DATABASE_URL?: string;

    // Authentication
    JWT_SECRET?: string;

    // Test Environment Variables
    TEST_TRUE?: string;
    TEST_FALSE?: string;
    TEST_STRING?: string;

    // Claude Code OAuth
    CLAUDE_CODE_OAUTH_TOKEN?: string;
  }
}

// For import.meta.env compatibility (if needed for non-Vite apps)
interface ImportMetaEnv {
  // OpenAI Configuration
  readonly OPENAI_API_KEY?: string;

  // Database Configuration
  readonly DATABASE_URL?: string;

  // Authentication
  readonly JWT_SECRET?: string;

  // Test Environment Variables
  readonly TEST_TRUE?: string;
  readonly TEST_FALSE?: string;
  readonly TEST_STRING?: string;

  // Claude Code OAuth
  readonly CLAUDE_CODE_OAUTH_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
