// Temporary stub — just enough for imports to compile.
// Real implementation will track an active adapter and expose get()/register().

/**
 * Generic contract every backend adapter must fulfil.
 * For now we alias the existing DatabaseBackend interface so we don't
 * break any imports while refactoring.
 */
export type IBackendAdapter =
  import("../backend/DatabaseBackend.ts").DatabaseBackend;

export class AdapterRegistry {
  // We intentionally start with `null` so tests that call `get()` without
  // registering will throw — giving us a clear red state.
  private static _active: IBackendAdapter | null = null;

  static register(adapter: IBackendAdapter) {
    this._active = adapter;
  }

  /**
   * Returns the currently‑active adapter or throws if none registered.
   * Keeping the throw ensures existing tests fail until we wire up
   * the correct adapter in each suite.
   */
  static get(): IBackendAdapter {
    throw new Error("AdapterRegistry.get(): no adapter registered yet (stub)");
    // return this._active!;  // <- real impl will return and maybe throw
  }

  /** Test helper to clear registry between suites */
  static clear() {
    this._active = null;
  }
}
