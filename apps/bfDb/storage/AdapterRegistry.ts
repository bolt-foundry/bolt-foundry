// apps/bfDb/storage/AdapterRegistry.ts
// =================================================
// Storage Adapter Registry — concrete implementation
// =================================================

import { BfError } from "@bfmono/lib/BfError.ts";
import type { DatabaseBackend } from "../backend/DatabaseBackend.ts";

// Alias: moving forward we’ll refer to all adapters through this name.
export type IBackendAdapter = DatabaseBackend;

/**
 * Holds the singleton BackendAdapter selected for this process.
 * Tests can swap adapters by calling `register()`; production code should
 * register exactly once during startup (e.g. in bfDb.ts).
 */
export class AdapterRegistry {
  private static _active: IBackendAdapter | null = null;

  /**
   * Registers an adapter instance for the current runtime.
   * If an adapter has already been registered and it's different, we throw —
   * preventing accidental double‑registration in production. Tests may reset
   * via `clear()` between suites.
   */
  static register(adapter: IBackendAdapter) {
    if (this._active && this._active !== adapter) {
      throw new BfError("AdapterRegistry: adapter already registered");
    }
    this._active = adapter;
  }

  /**
   * Returns the active adapter. Throws if none registered so that tests stay
   * red until an adapter is explicitly set.
   */
  static get(): IBackendAdapter {
    if (!this._active) {
      throw new BfError("AdapterRegistry.get(): no adapter registered");
    }
    return this._active;
  }

  /**
   * Test helper – resets registry to pristine state.
   */
  static clear() {
    this._active = null;
  }
}
