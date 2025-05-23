import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { BfErrorNotImplemented } from "../lib/BfError.ts";

export type RenderOptions = Partial<ChatCompletionCreateParams> & {
  // Future: telemetry options
};

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
