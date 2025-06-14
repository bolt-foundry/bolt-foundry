import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

type TelemetryOptions = Record<string, unknown>;

// JSON types for context values
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

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
 * Generic card data structure for holding structured data.
 *
 * This is a core building block that can be used across the codebase
 * for any domain that needs hierarchical, structured cards.
 */
export type Card = {
  name?: string;
  value: string | Array<Card>;
  samples?: Array<Sample>;
  lead?: string;
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
  samples?: ((s: SampleBuilder) => SampleBuilder) | Array<Sample>;
};

/**
 * Generic builder type for creating Card instances.
 *
 * This builder follows the immutable pattern where each method returns
 * a new builder instance. This ensures predictable behavior and enables
 * safe method chaining.
 *
 * Modeled after the successful builder pattern used in bfDb.
 */
export type CardBuilder = {
  /** Add a simple spec value */
  spec(value: string): CardBuilder;

  /** Add a spec with options including samples */
  spec(value: string, options: SpecOptions): CardBuilder;

  /** Add a named group of specs using a builder function */
  card(name: string, builder: (c: CardBuilder) => CardBuilder): CardBuilder;

  /** Add a lead (transitional/explanatory text) */
  lead(text: string): CardBuilder;

  /** Get the collected cards */
  getCards(): Array<Card>;
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
 * Factory function to create a CardBuilder
 */
export function makeCardBuilder(cards: Array<Card> = []): CardBuilder {
  return {
    spec(value: string, options?: SpecOptions) {
      const valueCard: Card = { value };

      // If options are provided, process samples
      if (options?.samples) {
        let samples: Array<Sample> | undefined;

        if (Array.isArray(options.samples)) {
          // Array pattern - use samples directly
          if (options.samples.length > 0) {
            samples = options.samples;
          }
        } else {
          // Builder pattern - call the function
          const sampleBuilder = options.samples(makeSampleBuilder());
          const builtSamples = sampleBuilder.getSamples();
          if (builtSamples.length > 0) {
            samples = builtSamples;
          }
        }

        if (samples) {
          valueCard.samples = samples;
        }
      }

      return makeCardBuilder([...cards, valueCard]);
    },

    card(name: string, builder: (c: CardBuilder) => CardBuilder) {
      const childBuilder = builder(makeCardBuilder());
      const groupCard: Card = { value: childBuilder.getCards(), name };
      return makeCardBuilder([...cards, groupCard]);
    },

    lead(text: string) {
      const leadCard: Card = { value: "", lead: text };
      return makeCardBuilder([...cards, leadCard]);
    },

    getCards() {
      return cards;
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
 * Alias for deck cards
 */
export type CardForDeck = Card;

/**
 * Builder type for creating deck specifications
 */
export type DeckBuilder = {
  /** The name of this deck */
  readonly name: string;

  /** Add a simple spec value */
  spec(value: string): DeckBuilder;

  /** Add a spec with options including samples */
  spec(value: string, options: SpecOptions): DeckBuilder;

  /** Add a named group of specs using a builder function */
  card(
    name: string,
    builder: (c: CardBuilder) => CardBuilder,
  ): DeckBuilder;

  /** Add a lead (transitional/explanatory text) */
  lead(text: string): DeckBuilder;

  /** Add context variables */
  context(builder: (c: ContextBuilder) => ContextBuilder): DeckBuilder;

  /** Get the collected cards */
  getCards(): Array<Card>;

  /** Get the collected context variables */
  getContext(): Array<ContextVariable>;

  /** Render the deck specification to OpenAI chat completion format */
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
 * Factory function to create a DeckBuilder
 */
export function makeDeckBuilder(
  name: string,
  cards: Array<Card> = [],
  contextVariables: Array<ContextVariable> = [],
): DeckBuilder {
  // Helper function to render cards
  const renderCards = (
    cardsToRender: Array<Card>,
    indent: string = "",
  ): string => {
    return cardsToRender.map((card) => {
      let result = "";

      // Handle lead text if present
      if (card.lead) {
        result += indent + card.lead + "\n";
      }

      // Handle card value
      if (typeof card.value === "string" && card.value) {
        result += indent + card.value + "\n";
      } else if (Array.isArray(card.value)) {
        // Handle nested cards with optional grouping
        if (card.name) {
          result += indent + `<${card.name}>\n`;
          result += renderCards(card.value, indent + "  ");
          result += indent + `</${card.name}>\n`;
        } else {
          result += renderCards(card.value, indent);
        }
      }

      return result;
    }).join("");
  };

  return {
    name,

    spec(value: string, options?: SpecOptions) {
      const valueCard: Card = { value };

      // If options are provided, process samples
      if (options?.samples) {
        let samples: Array<Sample> | undefined;

        if (Array.isArray(options.samples)) {
          // Array pattern - use samples directly
          if (options.samples.length > 0) {
            samples = options.samples;
          }
        } else {
          // Builder pattern - call the function
          const sampleBuilder = options.samples(makeSampleBuilder());
          const builtSamples = sampleBuilder.getSamples();
          if (builtSamples.length > 0) {
            samples = builtSamples;
          }
        }

        if (samples) {
          valueCard.samples = samples;
        }
      }

      return makeDeckBuilder(
        name,
        [...cards, valueCard],
        contextVariables,
      );
    },

    card(groupName: string, builder: (c: CardBuilder) => CardBuilder) {
      const childBuilder = builder(makeCardBuilder());
      const groupCard: Card = {
        value: childBuilder.getCards(),
        name: groupName,
      };
      return makeDeckBuilder(
        name,
        [...cards, groupCard],
        contextVariables,
      );
    },

    lead(text: string) {
      const leadCard: Card = { value: "", lead: text };
      return makeDeckBuilder(
        name,
        [...cards, leadCard],
        contextVariables,
      );
    },

    context(builder: (c: ContextBuilder) => ContextBuilder) {
      const contextBuilder = builder(makeContextBuilder());
      const newVariables = contextBuilder.getVariables();
      return makeDeckBuilder(name, cards, [
        ...contextVariables,
        ...newVariables,
      ]);
    },

    getCards() {
      return cards;
    },

    getContext() {
      return contextVariables;
    },

    render(options: RenderOptions = {}) {
      const { messages = [], model = "gpt-4", context = {}, ...otherOptions } =
        options;

      // Build system message content
      let systemContent = "";

      // Render all cards
      if (cards.length > 0) {
        systemContent = renderCards(cards).trim();
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
 * Convenience function to start building cards
 */
export function card(
  name: string,
  builder: (c: CardBuilder) => CardBuilder,
): Card {
  const cardBuilder = builder(makeCardBuilder());
  return {
    name,
    value: cardBuilder.getCards(),
  };
}
