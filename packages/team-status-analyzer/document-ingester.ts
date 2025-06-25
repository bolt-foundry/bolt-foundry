/**
 * Document Ingester
 * Reads and analyzes company vision, strategy, and roadmap documents
 */

import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { CompanyContext, DocumentSource } from "./types.ts";

const logger = getLogger(import.meta);

export class DocumentIngester {
  private baseDir = "/home/runner/workspace";

  /**
   * Ingest all company context documents
   */
  async ingestCompanyContext(): Promise<CompanyContext> {
    const documents = await this.loadAllDocuments();
    return this.analyzeDocuments(documents);
  }

  /**
   * Load all documents from docs/ and memos/guides/
   */
  private async loadAllDocuments(): Promise<Array<DocumentSource>> {
    const documents: Array<DocumentSource> = [];

    // Load from docs/
    const docsPath = `${this.baseDir}/docs`;
    documents.push(...await this.loadDocumentsFromDirectory(docsPath));

    // Load from memos/guides/
    const memosPath = `${this.baseDir}/memos/guides`;
    documents.push(...await this.loadDocumentsFromDirectory(memosPath));

    return documents;
  }

  /**
   * Recursively load documents from a directory
   */
  private async loadDocumentsFromDirectory(
    dirPath: string,
  ): Promise<Array<DocumentSource>> {
    const documents: Array<DocumentSource> = [];

    try {
      for await (const entry of Deno.readDir(dirPath)) {
        const fullPath = `${dirPath}/${entry.name}`;

        if (entry.isFile && entry.name.endsWith(".md")) {
          try {
            const content = await Deno.readTextFile(fullPath);
            const stat = await Deno.stat(fullPath);

            documents.push({
              path: fullPath,
              content,
              lastModified: stat.mtime || new Date(),
              type: this.classifyDocument(entry.name, content),
            });
          } catch (error) {
            logger.warn(`Failed to read document ${fullPath}:`, error);
          }
        } else if (entry.isDirectory) {
          // Recursively load subdirectories
          documents.push(...await this.loadDocumentsFromDirectory(fullPath));
        }
      }
    } catch (error) {
      logger.warn(`Failed to read directory ${dirPath}:`, error);
    }

    return documents;
  }

  /**
   * Classify document type based on filename and content
   */
  private classifyDocument(
    filename: string,
    content: string,
  ): DocumentSource["type"] {
    const lower = filename.toLowerCase();
    const contentLower = content.toLowerCase();

    if (lower.includes("vision") || contentLower.includes("company vision")) {
      return "vision";
    }
    if (lower.includes("strategy") || contentLower.includes("strategy")) {
      return "strategy";
    }
    if (lower.includes("roadmap") || contentLower.includes("roadmap")) {
      return "roadmap";
    }
    if (lower.includes("philosophy") || contentLower.includes("philosophy")) {
      return "philosophy";
    }
    if (
      lower.includes("guide") || lower.includes("getting-started") ||
      lower.includes("quickstart")
    ) {
      return "guide";
    }

    return "other";
  }

  /**
   * Analyze documents to extract company context
   */
  private analyzeDocuments(documents: Array<DocumentSource>): CompanyContext {
    const vision = this.extractVision(documents);
    const strategy = this.extractStrategy(documents);
    const productRoadmap = this.extractProductRoadmap(documents);
    const technicalPhilosophy = this.extractTechnicalPhilosophy(documents);
    const coreCapabilities = this.extractCoreCapabilities(documents);
    const differentiators = this.extractDifferentiators(documents);

    return {
      vision,
      strategy,
      productRoadmap,
      technicalPhilosophy,
      coreCapabilities,
      differentiators,
      lastUpdated: new Date(),
    };
  }

  /**
   * Extract company vision from documents
   */
  private extractVision(documents: Array<DocumentSource>): string {
    const visionDocs = documents.filter((d) => d.type === "vision");
    if (visionDocs.length > 0) {
      return visionDocs.map((d) => d.content).join("\n\n");
    }

    // Look for vision sections in other documents
    const visionSections = documents
      .map((d) => this.extractSection(d.content, ["vision", "mission"]))
      .filter((s) => s.length > 0);

    return visionSections.join("\n\n");
  }

  /**
   * Extract strategy information
   */
  private extractStrategy(documents: Array<DocumentSource>): string {
    const strategyDocs = documents.filter((d) => d.type === "strategy");
    if (strategyDocs.length > 0) {
      return strategyDocs.map((d) => d.content).join("\n\n");
    }

    const strategySections = documents
      .map((d) =>
        this.extractSection(d.content, ["strategy", "approach", "big picture"])
      )
      .filter((s) => s.length > 0);

    return strategySections.join("\n\n");
  }

  /**
   * Extract product roadmap information
   */
  private extractProductRoadmap(documents: Array<DocumentSource>): string {
    const roadmapDocs = documents.filter((d) => d.type === "roadmap");
    if (roadmapDocs.length > 0) {
      return roadmapDocs.map((d) => d.content).join("\n\n");
    }

    // Look for roadmap/plan content
    const roadmapSections = documents
      .map((d) =>
        this.extractSection(d.content, [
          "roadmap",
          "plan",
          "future",
          "upcoming",
        ])
      )
      .filter((s) => s.length > 0);

    return roadmapSections.join("\n\n");
  }

  /**
   * Extract technical philosophy
   */
  private extractTechnicalPhilosophy(documents: Array<DocumentSource>): string {
    const philosophyDocs = documents.filter((d) => d.type === "philosophy");
    if (philosophyDocs.length > 0) {
      return philosophyDocs.map((d) => d.content).join("\n\n");
    }

    const philosophySections = documents
      .map((d) =>
        this.extractSection(d.content, [
          "philosophy",
          "principles",
          "approach",
          "methodology",
        ])
      )
      .filter((s) => s.length > 0);

    return philosophySections.join("\n\n");
  }

  /**
   * Extract core capabilities
   */
  private extractCoreCapabilities(
    documents: Array<DocumentSource>,
  ): Array<string> {
    const capabilities: Set<string> = new Set();

    for (const doc of documents) {
      // Look for capability-related keywords
      const capabilityKeywords = [
        "evaluation",
        "evals",
        "testing",
        "reliability",
        "llm",
        "ai",
        "machine learning",
        "inference",
        "optimization",
        "automation",
        "analysis",
        "monitoring",
        "quality",
      ];

      for (const keyword of capabilityKeywords) {
        if (doc.content.toLowerCase().includes(keyword)) {
          capabilities.add(keyword);
        }
      }

      // Extract from lists and bullet points
      const listItems = this.extractListItems(doc.content);
      for (const item of listItems) {
        if (item.length > 10 && item.length < 100) {
          capabilities.add(item);
        }
      }
    }

    return Array.from(capabilities).slice(0, 20); // Limit to top 20
  }

  /**
   * Extract differentiators
   */
  private extractDifferentiators(
    documents: Array<DocumentSource>,
  ): Array<string> {
    const differentiators: Set<string> = new Set();

    for (const doc of documents) {
      // Look for differentiator keywords
      const diffKeywords = [
        "unique",
        "different",
        "unlike",
        "novel",
        "innovative",
        "first",
        "only",
        "better",
        "superior",
        "advantage",
      ];

      const sentences = doc.content.split(/[.!?]+/);
      for (const sentence of sentences) {
        const lower = sentence.toLowerCase();
        if (diffKeywords.some((keyword) => lower.includes(keyword))) {
          const clean = sentence.trim();
          if (clean.length > 20 && clean.length < 200) {
            differentiators.add(clean);
          }
        }
      }
    }

    return Array.from(differentiators).slice(0, 10); // Limit to top 10
  }

  /**
   * Extract sections by heading keywords
   */
  private extractSection(content: string, keywords: Array<string>): string {
    const lines = content.split("\n");
    const sections: Array<string> = [];
    let currentSection = "";
    let inTargetSection = false;

    for (const line of lines) {
      const lower = line.toLowerCase();

      // Check if this is a heading
      if (line.startsWith("#")) {
        // Save previous section if we were in a target section
        if (inTargetSection && currentSection.trim()) {
          sections.push(currentSection.trim());
        }

        // Check if this heading matches our keywords
        inTargetSection = keywords.some((keyword) => lower.includes(keyword));
        currentSection = "";
      } else if (inTargetSection) {
        currentSection += line + "\n";
      }
    }

    // Don't forget the last section
    if (inTargetSection && currentSection.trim()) {
      sections.push(currentSection.trim());
    }

    return sections.join("\n\n");
  }

  /**
   * Extract list items from markdown content
   */
  private extractListItems(content: string): Array<string> {
    const items: Array<string> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("- ") || trimmed.startsWith("* ") ||
        trimmed.match(/^\d+\./)
      ) {
        const item = trimmed.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "")
          .trim();
        if (item.length > 0) {
          items.push(item);
        }
      }
    }

    return items;
  }
}
