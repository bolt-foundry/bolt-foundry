/**
 * Split compiletime options from runtime options.
 *
 * @param {Readonly<EvaluateOptions> | null | undefined} options
 *   Configuration.
 * @returns {{compiletime: CompileOptions, runtime: RunOptions}}
 *   Split options.
 */
export function resolveEvaluateOptions(options: Readonly<EvaluateOptions> | null | undefined): {
    compiletime: CompileOptions;
    runtime: RunOptions;
};
export type Fragment = import('https://esm.sh/v135/hast-util-to-jsx-runtime@2.3.0/index.d.ts').Fragment;
export type Jsx = import('https://esm.sh/v135/hast-util-to-jsx-runtime@2.3.0/index.d.ts').Jsx;
export type JsxDev = import('https://esm.sh/v135/hast-util-to-jsx-runtime@2.3.0/index.d.ts').JsxDev;
export type Components = import('https://esm.sh/v135/@types/mdx@2.0.10/types.d.ts').MDXComponents;
export type CompileOptions = import('../compile.d.ts').CompileOptions;
/**
 * Configuration for `evaluate`.
 */
export type EvaluateOptions = EvaluateProcessorOptions & RunOptions;
/**
 * Compile configuration without JSX options for evaluation.
 */
export type EvaluateProcessorOptions = Omit<CompileOptions, 'baseUrl' | 'jsx' | 'jsxImportSource' | 'jsxRuntime' | 'outputFormat' | 'pragma' | 'pragmaFrag' | 'pragmaImportSource' | 'providerImportSource'>;
/**
 * Configuration to run compiled code.
 *
 * `Fragment`, `jsx`, and `jsxs` are used when the code is compiled in
 * production mode (`development: false`).
 * `Fragment` and `jsxDEV` are used when compiled in development mode
 * (`development: true`).
 * `useMDXComponents` is used when the code is compiled with
 * `providerImportSource: '#'` (the exact value of this compile option
 * doesn’t matter).
 */
export type RunOptions = {
    /**
     * Use this URL as `import.meta.url` and resolve `import` and `export … from`
     * relative to it (optional, example: `import.meta.url`);
     * this option can also be given at compile time in `CompileOptions`;
     * you should pass this (likely at runtime), as you might get runtime errors
     * when using `import.meta.url` / `import` / `export … from ` otherwise.
     */
    baseUrl?: URL | string | null | undefined;
    /**
     *   Symbol to use for fragments (**required**).
     */
    Fragment: Fragment;
    /**
     * Function to generate an element with static children in production mode.
     */
    jsx?: Jsx | null | undefined;
    /**
     * Function to generate an element in development mode.
     */
    jsxDEV?: JsxDev | null | undefined;
    /**
     * Function to generate an element with dynamic children in production mode.
     */
    jsxs?: Jsx | null | undefined;
    /**
     * Function to get components from context.
     */
    useMDXComponents?: UseMdxComponents | null | undefined;
};
/**
 * Get components from context.
 */
export type UseMdxComponents = () => Components;