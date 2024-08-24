import { type Root } from 'https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts';
import { type Plugin } from 'https://esm.sh/v135/unified@11.0.4/index.d.ts';
type FrontmatterParsers = Record<string, (value: string) => unknown>;
export interface RemarkMdxFrontmatterOptions {
    /**
     * If specified, the YAML data is exported using this name. Otherwise, each
     * object key will be used as an export name.
     */
    name?: string;
    /**
     * A mapping of node types to parsers.
     *
     * Each key represents a frontmatter node type. The value is a function that accepts the
     * frontmatter data as a string, and returns the parsed data.
     *
     * By default `yaml` nodes will be parsed using [`yaml`](https://github.com/eemeli/yaml) and
     * `toml` nodes using [`toml`](https://github.com/BinaryMuse/toml-node).
     */
    parsers?: FrontmatterParsers;
}
/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options Optional options to configure the output.
 * @returns A unified transformer.
 */
declare const remarkMdxFrontmatter: Plugin<[RemarkMdxFrontmatterOptions?], Root>;
export default remarkMdxFrontmatter;
