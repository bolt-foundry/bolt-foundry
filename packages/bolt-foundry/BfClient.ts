import { connectBoltFoundry } from "./bolt-foundry.ts";
import { type DeckBuilder, makeDeckBuilder } from "./builders/builders.ts";

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
   * Create a new deck specification using the builder pattern
   */
  createDeck(
    name: string,
    builder: (b: DeckBuilder) => DeckBuilder,
  ): DeckBuilder {
    return builder(makeDeckBuilder(name));
  }

  /**
   * Create a new assistant deck specification using the builder pattern
   */
  createAssistantDeck(
    name: string,
    builder: (b: DeckBuilder) => DeckBuilder,
  ): DeckBuilder {
    return this.createDeck(name, builder);
  }

  /**
   * Get the wrapped fetch function for making API calls with telemetry
   */
  get fetch(): typeof fetch {
    return this._fetch;
  }
}
