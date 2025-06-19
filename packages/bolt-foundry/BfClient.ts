import { connectBoltFoundry } from "./bolt-foundry.ts";

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
   * Get the wrapped fetch function for making API calls with telemetry
   */
  get fetch(): typeof fetch {
    return this._fetch;
  }
}
