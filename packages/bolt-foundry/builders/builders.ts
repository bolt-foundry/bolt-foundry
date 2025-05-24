import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

type TelemetryOptions = Record<string, unknown>;
export type RenderOptions =
  & Partial<ChatCompletionCreateParams>
  & TelemetryOptions;

export class Spec {
  name?: string;
  value: string | Array<Spec>;

  constructor(value: string | Array<Spec>, name?: string) {
    this.value = value;
    this.name = name;
  }
}

export class SpecBuilder {
  private _specs: Array<Spec> = [];

  /** Add a simple spec value */
  spec(value: string): SpecBuilder {
    const newBuilder = new SpecBuilder();
    newBuilder._specs = [...this._specs];

    const valueSpec = new Spec(value);
    newBuilder._specs.push(valueSpec);

    return newBuilder;
  }

  /** Add a named group of specs using a builder function */
  specs(name: string, builder: (s: SpecBuilder) => SpecBuilder): SpecBuilder {
    const newBuilder = new SpecBuilder();
    newBuilder._specs = [...this._specs];

    const childBuilder = builder(new SpecBuilder());
    const groupSpec = new Spec(childBuilder._specs, name);
    newBuilder._specs.push(groupSpec);

    return newBuilder;
  }

  getSpecs(): Array<Spec> {
    return this._specs;
  }
}

/** Assistant specification that can be rendered to OpenAI format */
export class SpecForAssistant {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  /** Render the assistant specification to OpenAI chat completion format */
  render(options: RenderOptions = {}): ChatCompletionCreateParams {
    const { messages = [], model = "gpt-4", ...otherOptions } = options;

    // Build system message
    const systemMessage = {
      role: "system" as const,
      content: "", // TODO: Generate from persona and constraints
    };

    // Combine system message with any user-provided messages
    const allMessages = [systemMessage, ...messages];

    return {
      model,
      messages: allMessages,
      ...otherOptions, // This will include any other OpenAI params
    };
  }
}

/** Builder for creating assistant specifications */
export class SpecBuilderForAssistant {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  /** Add a persona section */
  persona(
    _builder: (p: PersonaBuilder) => PersonaBuilder,
  ): SpecBuilderForAssistant {
    // TODO: Implement
    return this;
  }

  /** Add a constraints section */
  constraints(
    _builder: (c: ConstraintsBuilder) => ConstraintsBuilder,
  ): SpecBuilderForAssistant {
    // TODO: Implement
    return this;
  }

  /** Build the final assistant specification */
  build(): SpecForAssistant {
    return new SpecForAssistant(this._name);
  }
}

/** Builder for persona specifications */
export class PersonaBuilder {
  /** Set the persona description */
  description(_value: string): PersonaBuilder {
    // TODO: Implement
    return this;
  }

  /** Add a trait */
  trait(_value: string): PersonaBuilder {
    // TODO: Implement
    return this;
  }

  /** Get the built specs */
  getSpecs(): Array<Spec> {
    // TODO: Implement
    return [];
  }
}

/** Builder for constraints specifications */
export class ConstraintsBuilder {
  /** Add a constraint */
  constraint(_value: string): ConstraintsBuilder {
    // TODO: Implement
    return this;
  }

  /** Get the built specs */
  getSpecs(): Array<Spec> {
    // TODO: Implement
    return [];
  }
}

/** Main client for creating assistants */
export const boltFoundryClient = {
  /** Create a new assistant with the given name and configuration */
  createAssistant(
    name: string,
    builder: (b: SpecBuilderForAssistant) => SpecBuilderForAssistant,
  ): SpecForAssistant {
    const assistantBuilder = builder(new SpecBuilderForAssistant(name));
    return assistantBuilder.build();
  },
};
