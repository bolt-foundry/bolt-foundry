# E2E Testing Implementation Plan - Version 0.1

**Version:** 0.1 **Date:** 2023-07-10

## Version Summary

Establish a foundation for end-to-end testing in Bolt Foundry, focusing on
critical user flows and core functionality with a Deno-compatible testing
solution.

## Technical Goals

- Set up a reliable e2e testing infrastructure using Deno-compatible tools
- Create initial test coverage for the most critical user journeys
- Establish patterns for writing and maintaining e2e tests
- Integrate with existing BFF CLI for local and CI execution

## Components and Implementation

### 1. Testing Framework Setup

**Description**: Implement a Deno-compatible e2e testing solution that works
with our existing stack.

**Technical Approach**:

- Utilize Deno's built-in testing capabilities combined with Puppeteer or
  Playwright
- Create browser automation helpers optimized for our UI components
- Set up test runner configuration with appropriate timeouts and retries

**Implementation Steps**:

```typescript
// Example structure for e2e test setup
// infra/testing/e2e-testing.ts

import { DOMParser } from "@b-fuze/deno-dom";
import { Browser, Page } from "puppeteer";

export interface E2ETestContext {
  browser: Browser;
  page: Page;
  // Additional context properties
}

/**
 * Sets up the e2e test environment
 */
export async function setupE2ETest(): Promise<E2ETestContext> {
  // Implementation details
}

/**
 * Tears down the e2e test environment
 */
export async function teardownE2ETest(context: E2ETestContext): Promise<void> {
  // Implementation details
}

/**
 * Helper for navigation and waiting for page load
 */
export async function navigateTo(page: Page, url: string): Promise<void> {
  // Implementation details
}

// Additional helper functions for common testing operations
```

### 2. Page Object Models

**Description**: Create a structure for modeling application pages and
components to make tests more maintainable.

**Technical Approach**:

- Define a base Page class that provides common functionality
- Create specific page objects for each major application section
- Implement component objects for reusable UI elements

**Implementation Steps**:

```typescript
// Example page object structure
// infra/testing/e2e/pages/BasePage.ts

import { Page } from "puppeteer";

export class BasePage {
  constructor(protected page: Page) {}

  async waitForPageLoad(): Promise<void> {
    // Implementation details
  }

  async getByTestId(testId: string): Promise<Element | null> {
    // Implementation details
  }

  // Additional common methods
}

// infra/testing/e2e/pages/LoginPage.ts
import { BasePage } from "./BasePage.ts";

export class LoginPage extends BasePage {
  async login(username: string, password: string): Promise<void> {
    // Implementation details
  }

  async verifyLoginError(expectedError: string): Promise<boolean> {
    // Implementation details
  }

  // Additional page-specific methods
}
```

### 3. Initial Test Coverage

**Description**: Implement initial tests for critical user flows and core
functionality.

**Technical Approach**:

- Focus on smoke tests for the most important user journeys
- Create tests that verify end-to-end functionality rather than implementation
  details
- Structure tests to be resilient to UI changes

**Implementation Steps**:

```typescript
// Example test for login flow
// infra/testing/e2e/tests/authentication.test.ts

import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { setupE2ETest, teardownE2ETest } from "../e2e-testing.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import { HomePage } from "../pages/HomePage.ts";

Deno.test("User can log in with valid credentials", async () => {
  const context = await setupE2ETest();
  try {
    const loginPage = new LoginPage(context.page);
    await loginPage.navigate();
    await loginPage.login("testuser@example.com", "password123");

    const homePage = new HomePage(context.page);
    const isLoggedIn = await homePage.isUserLoggedIn();

    assertEquals(
      isLoggedIn,
      true,
      "User should be logged in after successful login",
    );
  } finally {
    await teardownE2ETest(context);
  }
});
```

### 4. CI Integration

**Description**: Integrate e2e tests with the existing CI/CD pipeline and BFF
CLI.

**Technical Approach**:

- Add commands to BFF CLI for running e2e tests
- Configure CI to run e2e tests on pull requests and main branch
- Set up reporting and notifications for test failures

**Implementation Steps**:

```typescript
// Example BFF command for e2e tests
// infra/bff/friends/e2e.bff.ts

import { Command } from "../shellBase.ts";

export default class E2ECommand extends Command {
  name = "e2e";
  description = "Run end-to-end tests";

  async execute(args: string[]): Promise<void> {
    // Implementation details for running e2e tests
  }
}
```

## Integration Points

- **UI Components**: Tests will interact with existing UI components via the DOM
- **BFF CLI**: Add commands for running and managing e2e tests
- **CI Pipeline**: Configure GitHub Actions to run e2e tests on PRs
- **Reporting**: Generate test reports compatible with existing tools

## Testing Strategy

- **Test Selection**: Prioritize critical user flows for initial implementation
- **Data Management**: Create test data setup and teardown utilities
- **Environment Handling**: Configure tests to run against dev, staging, or
  local environments
- **Failure Handling**: Implement retry logic and clear failure reporting

## Next Steps for Version 0.2

- Expand test coverage to additional user flows
- Implement visual regression testing for key components
- Create performance measurement baselines
- Improve test reporting and dashboards
