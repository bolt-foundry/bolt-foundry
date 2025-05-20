// deno-lint-ignore-file
// deno-fmt-ignore-file

export interface InstantiateResult {
  instance: WebAssembly.Instance;
  exports: {
    WasmLockfile : typeof WasmLockfile ;
    WasmWorkspace : typeof WasmWorkspace ;
    WasmWorkspaceResolver : typeof WasmWorkspaceResolver 
  };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated(): boolean;


/** Instantiates an instance of the Wasm module returning its functions.
* @remarks It is safe to call this multiple times and once successfully
* loaded it will always return a reference to the same object. */
export function instantiate(): InstantiateResult["exports"];

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object. */
export function instantiateWithInstance(): InstantiateResult;

/**
*/
export class WasmLockfile {
  free(): void;
/**
* @param {string} file_path
* @param {string} content
*/
  constructor(file_path: string, content: string);
/**
* @param {string} specifier
* @returns {string | undefined}
*/
  package_version(specifier: string): string | undefined;
}
/**
*/
export class WasmWorkspace {
  free(): void;
/**
* @param {(string)[]} entrypoints
* @param {boolean} is_config_file
* @returns {WasmWorkspace}
*/
  static discover(entrypoints: (string)[], is_config_file: boolean): WasmWorkspace;
/**
* @returns {string | undefined}
*/
  lock_path(): string | undefined;
/**
* @returns {string}
*/
  node_modules_dir(): string;
/**
* @param {string | undefined} import_map_url
* @param {any} import_map_value
* @returns {WasmWorkspaceResolver}
*/
  resolver(import_map_url: string | undefined, import_map_value: any): WasmWorkspaceResolver;
}
/**
*/
export class WasmWorkspaceResolver {
  free(): void;
/**
* @param {string} specifier
* @param {string} referrer
* @returns {string}
*/
  resolve(specifier: string, referrer: string): string;
}
