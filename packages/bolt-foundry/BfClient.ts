import { connectBoltFoundry } from "./bolt-foundry.ts";
import {
  makeSpecBuilderForAssistant,
  type SpecBuilderForAssistant,
} from "./builders/builders.ts";

/**
 * Main Bolt Foundry client for all SDK functionality
 */
export class BfClient {
  private _fetch: typeof fetch;

  private constructor(fetchFn: typeof fetch) {
    this._fetch = fetchFn;
  }

  /**
   * Create a new BfClient instance with the given configuration
   */
  static create(options: {
    apiKey?: string;
    collectorEndpoint?: string;
  } = {}): BfClient {
    const wrappedFetch = connectBoltFoundry(
      options.apiKey,
      options.collectorEndpoint,
    );
    return new BfClient(wrappedFetch);
  }

  /**
   * Create a new assistant specification using the builder pattern
   */
  createAssistant(
    name: string,
    builder: (b: SpecBuilderForAssistant) => SpecBuilderForAssistant,
  ): SpecBuilderForAssistant {
    return builder(makeSpecBuilderForAssistant(name));
  }

  /**
   * Get the wrapped fetch function for making API calls with telemetry
   */
  get fetch(): typeof fetch {
    return this._fetch;
  }
}
