import { join } from "@std/path";
import { exists } from "@std/fs";
import { parse as parseToml } from "@std/toml";
import type { DocumentSection, SectionConfig } from "./DocumentStructure.ts";
import { extractOrderPrefix, slugToTitle } from "./DocumentStructure.ts";

/**
 * Build a hierarchical document structure from a directory.
 */
export class DocumentStructureBuilder {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  /**
   * Build the complete document structure starting from the base directory.
   */
  async build(): Promise<DocumentSection> {
    return await this.buildSection(this.baseDir, "root", 0);
  }

  /**
   * Build a section from a directory.
   */
  private async buildSection(
    dirPath: string,
    slug: string,
    defaultOrder: number,
  ): Promise<DocumentSection> {
    // Load config if it exists
    const config = await this.loadConfig(dirPath);

    // Extract order and clean name from slug
    const { order, cleanName } = extractOrderPrefix(slug);

    const section: DocumentSection = {
      slug: cleanName,
      title: config?.section?.title || slugToTitle(cleanName),
      description: config?.section?.description,
      documents: [],
      subsections: [],
      path: dirPath,
      order: order !== 999 ? order : defaultOrder,
    };

    // Get hidden files list
    const hiddenFiles = new Set(config?.settings?.hidden || []);

    // Read directory contents
    const entries: Array<
      { name: string; isDirectory: boolean; isFile: boolean }
    > = [];
    try {
      for await (const entry of Deno.readDir(dirPath)) {
        // Treat symlinks as files if they end with .md
        const isMarkdownSymlink = entry.isSymlink && entry.name.endsWith(".md");
        entries.push({
          name: entry.name,
          isDirectory: entry.isDirectory && !isMarkdownSymlink,
          isFile: entry.isFile || isMarkdownSymlink,
        });
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return section;
      }
      throw error;
    }

    // Separate directories and files
    const directories = entries
      .filter((e) => e.isDirectory)
      .filter((e) => !e.name.startsWith("."));

    const files = entries
      .filter((e) => e.isFile && e.name.endsWith(".md"))
      .filter((e) => !hiddenFiles.has(e.name))
      .filter((e) => e.name !== "config.toml")
      .sort((a, b) => a.name.localeCompare(b.name));

    // Process subdirectories
    // Sort directories by name first to ensure consistent ordering
    directories.sort((a, b) => a.name.localeCompare(b.name));

    let sectionOrder = 0;
    for (const dir of directories) {
      const subSection = await this.buildSection(
        join(dirPath, dir.name),
        dir.name,
        sectionOrder++,
      );
      section.subsections.push(subSection);
    }

    // Process documents
    if (config?.documents) {
      // Use configured order
      for (let i = 0; i < config.documents.length; i++) {
        const docConfig = config.documents[i];
        const fileName = `${docConfig.slug}.md`;

        if (files.some((f) => f.name === fileName)) {
          section.documents.push({
            slug: docConfig.slug,
            title: docConfig.title || slugToTitle(docConfig.slug),
            path: join(dirPath, fileName),
            order: i,
          });
        }
      }

      // Add any unconfigured files at the end
      const configuredSlugs = new Set(
        config.documents.map((d) => `${d.slug}.md`),
      );
      let order = config.documents.length;
      for (const file of files) {
        if (!configuredSlugs.has(file.name)) {
          const slug = file.name.replace(".md", "");
          section.documents.push({
            slug,
            title: slugToTitle(slug),
            path: join(dirPath, file.name),
            order: order++,
          });
        }
      }
    } else {
      // Default ordering: README first, then alphabetical
      let order = 0;

      // README always first
      const readmeIndex = files.findIndex((f) =>
        f.name.toLowerCase() === "readme.md"
      );
      if (readmeIndex >= 0) {
        const readme = files.splice(readmeIndex, 1)[0];
        section.documents.push({
          slug: "README",
          title: "Overview",
          path: join(dirPath, readme.name),
          order: order++,
        });
      }

      // Rest in alphabetical order
      for (const file of files) {
        const slug = file.name.replace(".md", "");
        const { cleanName } = extractOrderPrefix(slug);
        section.documents.push({
          slug: cleanName,
          title: slugToTitle(cleanName),
          path: join(dirPath, file.name),
          order: order++,
        });
      }
    }

    // Sort subsections by order
    section.subsections.sort((a, b) => a.order - b.order);

    // Sort documents by order
    section.documents.sort((a, b) => a.order - b.order);

    return section;
  }

  /**
   * Load and parse config.toml from a directory.
   */
  private async loadConfig(dirPath: string): Promise<SectionConfig | null> {
    const configPath = join(dirPath, "config.toml");

    if (!(await exists(configPath))) {
      return null;
    }

    try {
      const content = await Deno.readTextFile(configPath);
      return parseToml(content) as SectionConfig;
    } catch (_error) {
      // Silently ignore config parsing errors
      return null;
    }
  }
}
