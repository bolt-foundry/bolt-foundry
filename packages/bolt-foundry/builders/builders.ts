import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

type TelemetryOptions = Record<string, unknown>;

// JSON types for context values
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

export type RenderOptions =
  & Partial<ChatCompletionCreateParams>
  & TelemetryOptions
  & {
    context?: Record<string, JSONValue>;
  };

/**
 * Sample data for specifications with a rating from -3 to +3
 * Positive values indicate good examples, negative values indicate bad examples
 */
export type Sample = {
  text: string;
  rating: number; // -3 to +3
  description?: string;
};

/**
 * Generic specification data structure for holding structured data.
 *
 * This is a core building block that can be used across the codebase
 * for any domain that needs hierarchical, structured specifications.
 */
export type Spec = {
  name?: string;
  value: string | Array<Spec>;
  samples?: Array<Sample>;
};

/**
 * Builder for adding samples to a spec
 */
export type SampleBuilder = {
  /** Add a sample with text and rating (-3 to +3) */
  sample(text: string, rating: number): SampleBuilder;

  /** Get the collected samples */
  getSamples(): Array<Sample>;
};

/**
 * Options for spec method including samples
 */
export type SpecOptions = {
  samples?: (s: SampleBuilder) => SampleBuilder;
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

  /** Add a spec with options including samples */
  spec(value: string, options: SpecOptions): SpecBuilder;

  /** Add a named group of specs using a builder function */
  specs(name: string, builder: (s: SpecBuilder) => SpecBuilder): SpecBuilder;

  /** Get the collected specs */
  getSpecs(): Array<Spec>;
};

/**
 * Factory function to create a SampleBuilder
 */
export function makeSampleBuilder(samples: Array<Sample> = []): SampleBuilder {
  return {
    sample(text: string, rating: number) {
      return makeSampleBuilder([...samples, { text, rating }]);
    },

    getSamples() {
      return samples;
    },
  };
}

/**
 * Factory function to create a SpecBuilder
 */
export function makeSpecBuilder(specs: Array<Spec> = []): SpecBuilder {
  return {
    spec(value: string, options?: SpecOptions) {
      const valueSpec: Spec = { value };

      // If options are provided, process samples
      if (options?.samples) {
        const sampleBuilder = options.samples(makeSampleBuilder());
        const samples = sampleBuilder.getSamples();
        if (samples.length > 0) {
          valueSpec.samples = samples;
        }
      }

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
 * Context variable definition
 */
export type ContextVariable = {
  name: string;
  type: "string" | "number" | "boolean" | "object";
  question: string;
};

/**
 * Builder for context variables
 */
export type ContextBuilder = {
  /** Add a string context variable */
  string(name: string, question: string): ContextBuilder;

  /** Add a number context variable */
  number(name: string, question: string): ContextBuilder;

  /** Add a boolean context variable */
  boolean(name: string, question: string): ContextBuilder;

  /** Add an object context variable */
  object(name: string, question: string): ContextBuilder;

  /** Get the collected context variables */
  getVariables(): Array<ContextVariable>;
};

/**
 * Alias for card specifications
 */
export type SpecForCard = Spec;

/**
 * Builder type for creating card specifications
 */
export type SpecBuilderForCard = {
  /** The name of this card */
  readonly name: string;

  /** Add a simple spec value */
  spec(value: string): SpecBuilderForCard;

  /** Add a spec with options including samples */
  spec(value: string, options: SpecOptions): SpecBuilderForCard;

  /** Add a named group of specs using a builder function */
  specs(
    name: string,
    builder: (s: SpecBuilder) => SpecBuilder,
  ): SpecBuilderForCard;

  /** Add context variables */
  context(builder: (c: ContextBuilder) => ContextBuilder): SpecBuilderForCard;

  /** Get the collected specs */
  getSpecs(): Array<Spec>;

  /** Get the collected context variables */
  getContext(): Array<ContextVariable>;

  /** Render the card specification to OpenAI chat completion format */
  render(options?: RenderOptions): ChatCompletionCreateParams;
};

/**
 * Factory function to create a ContextBuilder
 */
export function makeContextBuilder(
  variables: Array<ContextVariable> = [],
): ContextBuilder {
  return {
    string(name: string, question: string) {
      return makeContextBuilder([...variables, {
        name,
        type: "string",
        question,
      }]);
    },

    number(name: string, question: string) {
      return makeContextBuilder([...variables, {
        name,
        type: "number",
        question,
      }]);
    },

    boolean(name: string, question: string) {
      return makeContextBuilder([...variables, {
        name,
        type: "boolean",
        question,
      }]);
    },

    object(name: string, question: string) {
      return makeContextBuilder([...variables, {
        name,
        type: "object",
        question,
      }]);
    },

    getVariables() {
      return variables;
    },
  };
}

/**
 * Factory function to create a SpecBuilderForCard
 */
export function makeSpecBuilderForCard(
  name: string,
  specs: Array<Spec> = [],
  contextVariables: Array<ContextVariable> = [],
): SpecBuilderForCard {
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

    spec(value: string, options?: SpecOptions) {
      const valueSpec: Spec = { value };

      // If options are provided, process samples
      if (options?.samples) {
        const sampleBuilder = options.samples(makeSampleBuilder());
        const samples = sampleBuilder.getSamples();
        if (samples.length > 0) {
          valueSpec.samples = samples;
        }
      }

      return makeSpecBuilderForCard(
        name,
        [...specs, valueSpec],
        contextVariables,
      );
    },

    specs(groupName: string, builder: (s: SpecBuilder) => SpecBuilder) {
      const childBuilder = builder(makeSpecBuilder());
      const groupSpec: Spec = {
        value: childBuilder.getSpecs(),
        name: groupName,
      };
      return makeSpecBuilderForCard(
        name,
        [...specs, groupSpec],
        contextVariables,
      );
    },

    context(builder: (c: ContextBuilder) => ContextBuilder) {
      const contextBuilder = builder(makeContextBuilder());
      const newVariables = contextBuilder.getVariables();
      return makeSpecBuilderForCard(name, specs, [
        ...contextVariables,
        ...newVariables,
      ]);
    },

    getSpecs() {
      return specs;
    },

    getContext() {
      return contextVariables;
    },

    render(options: RenderOptions = {}) {
      const { messages = [], model = "gpt-4", context = {}, ...otherOptions } =
        options;

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

      // Build context messages (Q&A pairs)
      const contextMessages: Array<
        { role: "assistant" | "user"; content: string }
      > = [];

      if (contextVariables.length > 0 && context) {
        for (const variable of contextVariables) {
          if (variable.name in context) {
            // Add assistant question
            contextMessages.push({
              role: "assistant" as const,
              content: variable.question,
            });

            // Add user response
            const value = context[variable.name];
            let content: string;

            if (typeof value === "object" && value !== null) {
              content = JSON.stringify(value);
            } else {
              content = String(value);
            }

            contextMessages.push({
              role: "user" as const,
              content,
            });
          }
        }
      }

      // Combine system message with context messages and any user-provided messages
      const allMessages = [systemMessage, ...contextMessages, ...messages];

      return {
        model,
        messages: allMessages,
        ...otherOptions, // This will include any other OpenAI params
      };
    },
  };
}

/**
 * Convenience function to start building specs
 */
export function specs(
  name: string,
  builder: (s: SpecBuilder) => SpecBuilder,
): Spec {
  const specBuilder = builder(makeSpecBuilder());
  return {
    name,
    value: specBuilder.getSpecs(),
  };
}
