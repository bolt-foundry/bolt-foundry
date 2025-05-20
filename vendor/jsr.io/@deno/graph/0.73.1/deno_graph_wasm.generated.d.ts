// deno-lint-ignore-file
// deno-fmt-ignore-file

export interface InstantiateResult {
  instance: WebAssembly.Instance;
  exports: {
    createGraph: typeof createGraph;
    parseModule: typeof parseModule
  };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated(): boolean;

/** Options for instantiating a Wasm instance. */
export interface InstantiateOptions {
  /** Optional url to the Wasm file to instantiate. */
  url?: URL;
  /** Callback to decompress the raw Wasm file bytes before instantiating. */
  decompress?: (bytes: Uint8Array) => Uint8Array;
}

/** Instantiates an instance of the Wasm module returning its functions.
* @remarks It is safe to call this multiple times and once successfully
* loaded it will always return a reference to the same object. */
export function instantiate(opts?: InstantiateOptions): Promise<InstantiateResult["exports"]>;

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object. */
export function instantiateWithInstance(opts?: InstantiateOptions): Promise<InstantiateResult>;

/**
* @param {any} roots
* @param {Function} load
* @param {string | undefined} maybe_default_jsx_import_source
* @param {string | undefined} maybe_default_jsx_import_source_types
* @param {string | undefined} maybe_jsx_import_source_module
* @param {Function | undefined} maybe_cache_info
* @param {Function | undefined} maybe_resolve
* @param {Function | undefined} maybe_resolve_types
* @param {string | undefined} maybe_graph_kind
* @param {any} maybe_imports
* @returns {Promise<any>}
*/
export function createGraph(roots: any, load: Function, maybe_default_jsx_import_source: string | undefined, maybe_default_jsx_import_source_types: string | undefined, maybe_jsx_import_source_module: string | undefined, maybe_cache_info: Function | undefined, maybe_resolve: Function | undefined, maybe_resolve_types: Function | undefined, maybe_graph_kind: string | undefined, maybe_imports: any): Promise<any>;
/**
* @param {string} specifier
* @param {any} maybe_headers
* @param {string | undefined} maybe_default_jsx_import_source
* @param {string | undefined} maybe_default_jsx_import_types_source
* @param {string | undefined} maybe_jsx_import_source_module
* @param {Uint8Array} content
* @param {Function | undefined} [maybe_resolve]
* @param {Function | undefined} [maybe_resolve_types]
* @returns {any}
*/
export function parseModule(specifier: string, maybe_headers: any, maybe_default_jsx_import_source: string | undefined, maybe_default_jsx_import_types_source: string | undefined, maybe_jsx_import_source_module: string | undefined, content: Uint8Array, maybe_resolve?: Function, maybe_resolve_types?: Function): any;
