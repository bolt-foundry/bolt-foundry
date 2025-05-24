import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

type TelemetryOptions = Record<string, unknown>;
export type RenderOptions =
  & Partial<ChatCompletionCreateParams>
  & TelemetryOptions;

/**
 * Generic specification data structure for holding structured data.
 *
 * This is a core building block that can be used across the codebase
 * for any domain that needs hierarchical, structured specifications.
 */
export type Spec = {
  name?: string;
  value: string | Array<Spec>;
};

/**
 * Generic builder type for creating Spec instances.
 *
 * This builder follows the immutable pattern where each method returns
 * a new builder instance. This ensures predictable behavior and enables
 * safe method chaining.
 *
 * Modeled after the successful builder pattern used in bfDb.
 */
export type SpecBuilder = {
  /** Add a simple spec value */
  spec(value: string): SpecBuilder;

  /** Add a named group of specs using a builder function */
  specs(name: string, builder: (s: SpecBuilder) => SpecBuilder): SpecBuilder;

  /** Get the collected specs */
  getSpecs(): Array<Spec>;
};

/**
 * Factory function to create a SpecBuilder
 */
export function makeSpecBuilder(specs: Array<Spec> = []): SpecBuilder {
  return {
    spec(value: string) {
      const valueSpec: Spec = { value };
      return makeSpecBuilder([...specs, valueSpec]);
    },

    specs(name: string, builder: (s: SpecBuilder) => SpecBuilder) {
      const childBuilder = builder(makeSpecBuilder());
      const groupSpec: Spec = { value: childBuilder.getSpecs(), name };
      return makeSpecBuilder([...specs, groupSpec]);
    },

    getSpecs() {
      return specs;
    },
  };
}

/**
 * Alias for assistant specifications
 */
export type SpecForAssistant = Spec;

/**
 * Builder type for creating assistant specifications
 */
export type SpecBuilderForAssistant = {
  /** The name of this assistant */
  readonly name: string;

  /** Add a simple spec value */
  spec(value: string): SpecBuilderForAssistant;

  /** Add a named group of specs using a builder function */
  specs(
    name: string,
    builder: (s: SpecBuilder) => SpecBuilder,
  ): SpecBuilderForAssistant;

  /** Get the collected specs */
  getSpecs(): Array<Spec>;

  /** Render the assistant specification to OpenAI chat completion format */
  render(options?: RenderOptions): ChatCompletionCreateParams;
};

/**
 * Factory function to create a SpecBuilderForAssistant
 */
export function makeSpecBuilderForAssistant(
  name: string,
  specs: Array<Spec> = [],
): SpecBuilderForAssistant {
  // Helper function to render specs
  const renderSpecs = (
    specsToRender: Array<Spec>,
    indent: string = "",
  ): string => {
    return specsToRender.map((spec) => {
      if (typeof spec.value === "string") {
        return indent + spec.value + "\n";
      } else if (Array.isArray(spec.value)) {
        // Handle nested specs with optional grouping
        let result = "";
        if (spec.name) {
          result += indent + `<${spec.name}>\n`;
          result += renderSpecs(spec.value, indent + "  ");
          result += indent + `</${spec.name}>\n`;
        } else {
          result += renderSpecs(spec.value, indent);
        }
        return result;
      }
      return "";
    }).join("");
  };

  return {
    name,

    spec(value: string) {
      const valueSpec: Spec = { value };
      return makeSpecBuilderForAssistant(name, [...specs, valueSpec]);
    },

    specs(groupName: string, builder: (s: SpecBuilder) => SpecBuilder) {
      const childBuilder = builder(makeSpecBuilder());
      const groupSpec: Spec = {
        value: childBuilder.getSpecs(),
        name: groupName,
      };
      return makeSpecBuilderForAssistant(name, [...specs, groupSpec]);
    },

    getSpecs() {
      return specs;
    },

    render(options: RenderOptions = {}) {
      const { messages = [], model = "gpt-4", ...otherOptions } = options;

      // Build system message content
      let systemContent = "";

      // Render all specs
      if (specs.length > 0) {
        systemContent = renderSpecs(specs).trim();
      }

      // Build system message
      const systemMessage = {
        role: "system" as const,
        content: systemContent,
      };

      // Combine system message with any user-provided messages
      const allMessages = [systemMessage, ...messages];

      return {
        model,
        messages: allMessages,
        ...otherOptions, // This will include any other OpenAI params
      };
    },
  };
}
