# Phase 4: Advanced Features

## Overview

Building on the core implementation from Phases 1-3, this final phase introduces
advanced features to handle edge cases and provide comprehensive content
management capabilities. Following the "Worse is Better" philosophy, these
features are added last because they address less common scenarios and add
complexity that wasn't essential for the core functionality.

## Goals

- Implement symlink handling with loop detection and security measures
- Add content type detection based on file extensions and content analysis
- Handle binary files appropriately
- Add sorting and filtering options for content queries
- Implement file move/rename detection

## Referenced Files

- [packages/bfDb/models/BfContentCollection.ts](packages/bfDb/models/BfContentCollection.ts)
- [packages/bfDb/models/BfContentItem.ts](packages/bfDb/models/BfContentItem.ts)
- [packages/BfError.ts](packages/BfError.ts)
- [packages/logger.ts](packages/logger.ts)

## TDD Approach - Red Tests

First, we create failing tests that define the expected behavior for these
advanced features:

```typescript
Deno.test("BfContentCollection - symlink handling", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();
  const targetDir = await Deno.makeTempDir();

  try {
    // Create a file in the target directory
    await Deno.writeTextFile(`${targetDir}/target.md`, "# Target File");

    // Create a symlink in the temp directory pointing to the target directory
    const symlinkPath = `${tempDir}/symlink`;
    await Deno.symlink(targetDir, symlinkPath);

    // Create collection with symlink following enabled
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
      {
        followSymlinks: true,
        maxSymlinkDepth: 1,
      },
    );

    // Verify that the symlinked content is included when following symlinks
    const items = await collection.queryContentItems(mockCv, true);
    assertEquals(items.length, 1);
    assertEquals(items[0].props.slug, "target");

    // Create collection with symlink following disabled
    const collectionNoSymlinks = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
      {
        followSymlinks: false,
      },
    );

    // Verify that symlinked content is not included when not following symlinks
    const itemsNoSymlinks = await collectionNoSymlinks.queryContentItems(
      mockCv,
      true,
    );
    assertEquals(itemsNoSymlinks.length, 0);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
    await Deno.remove(targetDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - symlink loop detection", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create a directory structure within the temp directory
    const subDir = `${tempDir}/subdir`;
    await Deno.mkdir(subDir);

    // Create a file
    await Deno.writeTextFile(`${tempDir}/file.md`, "# Test File");

    // Create a symlink that creates a loop (subdir points to the parent)
    const symlinkPath = `${subDir}/loop`;
    await Deno.symlink(tempDir, symlinkPath);

    // Create collection with symlink following enabled
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
      {
        followSymlinks: true,
        maxSymlinkDepth: 3,
      },
    );

    // Verify that the content is properly scanned without infinite recursion
    const items = await collection.queryContentItems(mockCv, true);
    assertEquals(items.length, 1);
    assertEquals(items[0].props.slug, "file");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - content type detection", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create files of different types
    await Deno.writeTextFile(`${tempDir}/doc.md`, "# Markdown Document");
    await Deno.writeTextFile(`${tempDir}/data.json`, '{"key": "value"}');
    await Deno.writeTextFile(`${tempDir}/config.yaml`, "key: value");
    await Deno.writeTextFile(
      `${tempDir}/page.html`,
      "<html><body>Page</body></html>",
    );
    await Deno.writeTextFile(`${tempDir}/text.txt`, "Plain text file");

    // Create collection
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Get content items
    const items = await collection.queryContentItems(mockCv);
    assertEquals(items.length, 5);

    // Verify content types
    const mdItem = items.find((item) => item.props.slug === "doc");
    const jsonItem = items.find((item) => item.props.slug === "data");
    const yamlItem = items.find((item) => item.props.slug === "config");
    const htmlItem = items.find((item) => item.props.slug === "page");
    const txtItem = items.find((item) => item.props.slug === "text");

    assertNotEquals(mdItem, undefined);
    assertNotEquals(jsonItem, undefined);
    assertNotEquals(yamlItem, undefined);
    assertNotEquals(htmlItem, undefined);
    assertNotEquals(txtItem, undefined);

    assertEquals(mdItem?.props.contentType, "markdown");
    assertEquals(jsonItem?.props.contentType, "json");
    assertEquals(yamlItem?.props.contentType, "yaml");
    assertEquals(htmlItem?.props.contentType, "html");
    assertEquals(txtItem?.props.contentType, "text");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - binary file handling", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create a binary file (using a simple byte array)
    const binaryData = new Uint8Array([
      0x89,
      0x50,
      0x4E,
      0x47,
      0x0D,
      0x0A,
      0x1A,
      0x0A,
    ]); // PNG header
    await Deno.writeFile(`${tempDir}/image.png`, binaryData);

    // Create collection
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Get content items
    const items = await collection.queryContentItems(mockCv);
    assertEquals(items.length, 1);

    // Verify binary file handling
    const binaryItem = items[0];
    assertEquals(binaryItem.props.slug, "image");
    assertEquals(binaryItem.props.contentType, "binary");
    assertEquals(binaryItem.props.binarySize, binaryData.length);
    assertEquals(binaryItem.props.body, ""); // Body should be empty for binary files
    assertNotEquals(binaryItem.props.binaryPath, undefined); // Path to binary file should be stored
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - content query sorting and filtering", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create test files
    await Deno.writeTextFile(`${tempDir}/a.md`, "# A Document");
    await Deno.writeTextFile(`${tempDir}/b.md`, "# B Document");
    await Deno.writeTextFile(`${tempDir}/c.md`, "# C Document");

    // Create collection
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Test sorting ascending
    const itemsAsc = await collection.queryContentItems(mockCv, false, {
      sort: { field: "slug", order: "asc" },
    });
    assertEquals(itemsAsc.length, 3);
    assertEquals(itemsAsc[0].props.slug, "a");
    assertEquals(itemsAsc[1].props.slug, "b");
    assertEquals(itemsAsc[2].props.slug, "c");

    // Test sorting descending
    const itemsDesc = await collection.queryContentItems(mockCv, false, {
      sort: { field: "slug", order: "desc" },
    });
    assertEquals(itemsDesc.length, 3);
    assertEquals(itemsDesc[0].props.slug, "c");
    assertEquals(itemsDesc[1].props.slug, "b");
    assertEquals(itemsDesc[2].props.slug, "a");

    // Test filtering
    const filteredItems = await collection.queryContentItems(mockCv, false, {
      filter: { slug: "b" },
    });
    assertEquals(filteredItems.length, 1);
    assertEquals(filteredItems[0].props.slug, "b");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("BfContentCollection - file move/rename detection", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );
  const tempDir = await Deno.makeTempDir();

  try {
    // Create initial file
    const initialPath = `${tempDir}/initial.md`;
    const newPath = `${tempDir}/renamed.md`;
    await Deno.writeTextFile(initialPath, "# Test Content");

    // Create collection
    const collection = await BfContentCollection.createFromFolder(
      mockCv,
      tempDir,
    );

    // Initial verification
    const initialItems = await collection.queryContentItems(mockCv);
    assertEquals(initialItems.length, 1);
    assertEquals(initialItems[0].props.slug, "initial");

    // Capture initial file ID
    const initialId = initialItems[0].metadata.bfGid;

    // Rename the file
    await Deno.rename(initialPath, newPath);

    // Set up event listener for move events
    const moveEvents: ContentEvent[] = [];
    contentEvents.on(ContentEventType.MOVED, (event) => moveEvents.push(event));

    // Update collection with both old and new paths
    await BfContentCollection.detectFileRenames(cv, [
      { oldPath: initialPath, newPath: newPath },
    ]);

    // Verify renamed file is detected properly
    const renamedItems = await collection.queryContentItems(mockCv);
    assertEquals(renamedItems.length, 1);
    assertEquals(renamedItems[0].props.slug, "renamed");

    // Verify ID preservation and content
    assertEquals(renamedItems[0].metadata.bfGid, initialId); // ID should be preserved on rename
    assertEquals(renamedItems[0].props.body, "# Test Content");

    // Verify move event was emitted
    assertEquals(moveEvents.length, 1);
    assertEquals(moveEvents[0].type, ContentEventType.MOVED);
    assertEquals(moveEvents[0].contentId, initialId);
    assertEquals(moveEvents[0].path, newPath);
  } finally {
    contentEvents.removeAllListeners();
    await Deno.remove(tempDir, { recursive: true });
  }
});
```

## Implementation - Green Phase

### 1. Content Types Definition

```typescript
/**
 * Content type definitions
 */
export enum ContentType {
  MARKDOWN = "markdown",
  HTML = "html",
  JSON = "json",
  YAML = "yaml",
  TEXT = "text",
  BINARY = "binary",
  UNKNOWN = "unknown",
}

/**
 * Extended content item props
 */
export type BfContentItemProps = BfNodeBaseProps & {
  title: string;
  body: string;
  slug: string;
  filePath?: string;
  contentType?: string;
  binarySize?: number;
  binaryPath?: string;
  summary?: string;
  author?: string;
  cta?: string;
  href?: string;
};
```

### 2. Symlink Handling

```typescript
/**
 * Process directory entries with symlink handling
 * 
 * @param cv Current viewer for permission context
 * @param dirPath Directory path to process
 * @param options Processing options
 * @param parentCollection Parent collection
 * @param cache Node cache
 * @param seenPaths Set of already processed paths (for loop detection)
 * @returns Created or updated collection
 */
private static async _processDirectoryWithSymlinks(
  cv: BfCurrentViewer,
  dirPath: string,
  options: {
    followSymlinks?: boolean;
    maxSymlinkDepth?: number;
    seenPaths?: Set<string>;
    symlinkDepth?: number;
    [key: string]: any;
  },
  parentCollection?: BfContentCollection,
  cache?: BfNodeCache,
  seenPaths: Set<string> = new Set()
): Promise<BfContentCollection> {
  // Resolve absolute path
  const absolutePath = path.resolve(dirPath);
  
  // Check for symlink loops
  if (seenPaths.has(absolutePath)) {
    logger.warn(`Symlink loop detected: ${dirPath}`);
    
    // Create a placeholder collection but don't process its contents
    const loopCollection = await BfContentCollection.__DANGEROUS__createUnattached(
      cv,
      {
        name: path.basename(dirPath),
        slug: path.basename(dirPath),
        description: `Symlink loop detected: ${dirPath}`,
        isSymlink: true,
        symlinkTarget: absolutePath,
      },
      { bfGid: pathToBfGid(dirPath) },
      cache
    );
    
    // If this is a child collection, create relationship with parent
    if (parentCollection) {
      await BfEdge.createBetweenNodes(
        cv,
        parentCollection,
        loopCollection,
        "contains",
        undefined,
        cache
      );
    }
    
    return loopCollection;
  }
  
  // Add this path to seen paths to detect loops
  const updatedSeenPaths = new Set(seenPaths);
  updatedSeenPaths.add(absolutePath);
  
  // Check if this is a symlink
  const isSymlink = await Deno.lstat(dirPath)
    .then(stat => stat.isSymlink)
    .catch(() => false);
  
  if (isSymlink) {
    if (!options.followSymlinks) {
      logger.debug(`Skipping symlink: ${dirPath}`);
      
      // Create a placeholder collection that indicates a symlink but don't follow it
      const symCollection = await BfContentCollection.__DANGEROUS__createUnattached(
        cv,
        {
          name: path.basename(dirPath),
          slug: path.basename(dirPath),
          description: `Symlink: ${dirPath}`,
          isSymlink: true,
        },
        { bfGid: pathToBfGid(dirPath) },
        cache
      );
      
      // If this is a child collection, create relationship with parent
      if (parentCollection) {
        await BfEdge.createBetweenNodes(
          cv,
          parentCollection,
          symCollection,
          "contains",
          undefined,
          cache
        );
      }
      
      return symCollection;
    }
    
    // Check symlink depth
    const symlinkDepth = options.symlinkDepth || 0;
    const maxSymlinkDepth = options.maxSymlinkDepth ?? 5; // Default to 5 levels of symlink following
    
    if (symlinkDepth >= maxSymlinkDepth) {
      logger.warn(`Maximum symlink depth exceeded: ${dirPath}`);
      
      // Create a placeholder collection that indicates max depth reached
      const depthCollection = await BfContentCollection.__DANGEROUS__createUnattached(
        cv,
        {
          name: path.basename(dirPath),
          slug: path.basename(dirPath),
          description: `Max symlink depth reached: ${dirPath}`,
          isSymlink: true,
        },
        { bfGid: pathToBfGid(dirPath) },
        cache
      );
      
      // If this is a child collection, create relationship with parent
      if (parentCollection) {
        await BfEdge.createBetweenNodes(
          cv,
          parentCollection,
          depthCollection,
          "contains",
          undefined,
          cache
        );
      }
      
      return depthCollection;
    }
    
    try {
      // Resolve the real path of the symlink
      const realPath = await Deno.realPath(dirPath);
      logger.debug(`Following symlink: ${dirPath} -> ${realPath}`);
      
      // Update options for symlink processing
      const symlinkOptions = {
        ...options,
        symlinkDepth: symlinkDepth + 1,
      };
      
      // Process the real directory with updated options
      return this.createFromFolder(
        cv,
        realPath,
        symlinkOptions,
        parentCollection,
        cache,
        updatedSeenPaths
      );
    } catch (error) {
      logger.error(`Error following symlink ${dirPath}:`, error);
      
      // Create a placeholder collection that indicates a broken symlink
      const brokenSymCollection = await BfContentCollection.__DANGEROUS__createUnattached(
        cv,
        {
          name: path.basename(dirPath),
          slug: path.basename(dirPath),
          description: `Broken symlink: ${dirPath}`,
          isSymlink: true,
          isBroken: true,
        },
        { bfGid: pathToBfGid(dirPath) },
        cache
      );
      
      // If this is a child collection, create relationship with parent
      if (parentCollection) {
        await BfEdge.createBetweenNodes(
          cv,
          parentCollection,
          brokenSymCollection,
          "contains",
          undefined,
          cache
        );
      }
      
      return brokenSymCollection;
    }
  }
  
  // For non-symlinks, proceed with regular directory processing
  return this._processRegularDirectory(cv, dirPath, options, parentCollection, cache, updatedSeenPaths);
}
```

### 3. Content Type Detection

```typescript
/**
 * Detects content type based on file extension and content
 *
 * @param filePath File path to analyze
 * @param content File content (if available)
 * @returns Detected content type
 */
export function detectContentType(
  filePath: string,
  content?: string,
): ContentType {
  // Get file extension
  const ext = path.extname(filePath).toLowerCase();

  // First check by extension
  switch (ext) {
    case ".md":
    case ".mdx":
    case ".markdown":
      return ContentType.MARKDOWN;

    case ".html":
    case ".htm":
      return ContentType.HTML;

    case ".json":
      return ContentType.JSON;

    case ".yml":
    case ".yaml":
      return ContentType.YAML;

    case ".txt":
      return ContentType.TEXT;

    // Common binary file extensions
    case ".png":
    case ".jpg":
    case ".jpeg":
    case ".gif":
    case ".pdf":
    case ".zip":
    case ".tar":
    case ".gz":
    case ".rar":
    case ".doc":
    case ".docx":
    case ".xls":
    case ".xlsx":
    case ".ppt":
    case ".pptx":
    case ".mp3":
    case ".mp4":
    case ".avi":
    case ".mov":
    case ".wav":
      return ContentType.BINARY;
  }

  // If no match by extension and content is available, try to detect from content
  if (content) {
    // Check for binary content (contains NULL bytes or non-printable ASCII)
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content.substring(0, 1000))) {
      return ContentType.BINARY;
    }

    // Check content signatures
    if (
      content.startsWith("<!DOCTYPE html>") || content.startsWith("<html>") ||
      /<\s*html/i.test(content)
    ) {
      return ContentType.HTML;
    }

    if (content.startsWith("{") && content.endsWith("}")) {
      try {
        JSON.parse(content);
        return ContentType.JSON;
      } catch {
        // Not valid JSON
      }
    }

    if (/^---\s*\n(?:.*\n)*?---\s*\n/m.test(content)) {
      // Has frontmatter - likely Markdown or YAML
      if (
        content.includes("#") || content.includes("*") ||
        content.includes("[") && content.includes("]")
      ) {
        return ContentType.MARKDOWN;
      }
      return ContentType.YAML;
    }

    if (/^\s*[a-zA-Z0-9_-]+:\s*./m.test(content)) {
      // Looks like YAML format
      return ContentType.YAML;
    }

    // Check for basic Markdown patterns
    if (
      /#\s+/.test(content) || /\*\*\s*\w+\s*\*\*/.test(content) ||
      /\[.*\]\(.*\)/.test(content)
    ) {
      return ContentType.MARKDOWN;
    }
  }

  // Default to TEXT for unknown text files or UNKNOWN if we can't determine
  return content ? ContentType.TEXT : ContentType.UNKNOWN;
}

/**
 * Checks if a file is binary based on its content
 *
 * @param content File content or part of it
 * @returns True if content appears to be binary
 */
export function isBinaryContent(content: Uint8Array): boolean {
  // Check a sample of the content for NULL bytes or high concentration of non-ASCII
  const sampleSize = Math.min(1000, content.length);
  let nonPrintableCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const byte = content[i];
    // NULL bytes or control characters (except common whitespace)
    if (
      byte === 0 || (byte < 32 && ![9, 10, 13].includes(byte)) || byte > 126
    ) {
      nonPrintableCount++;
    }

    // If more than 10% is non-printable, consider it binary
    if (nonPrintableCount > sampleSize * 0.1) {
      return true;
    }
  }

  return false;
}
```

### 4. Binary File Handling

```typescript
/**
 * Processes a file for content collection
 * 
 * @param cv Current viewer for permission context
 * @param collection Parent collection
 * @param filePath File path to process
 * @param options Processing options
 * @param cache Node cache
 */
private static async _processFile(
  cv: BfCurrentViewer,
  collection: BfContentCollection,
  filePath: string,
  options: {
    skipBinaryContent?: boolean;
    maxBinarySize?: number;
    [key: string]: any;
  },
  cache?: BfNodeCache
): Promise<BfContentItem | null> {
  try {
    const absolutePath = path.resolve(filePath);
    const fileName = path.basename(filePath);
    const slug = path.basename(fileName, path.extname(fileName));
    
    // Get file stats
    const stat = await Deno.stat(absolutePath);
    const fileSizeBytes = stat.size;
    
    // Check file extension first to avoid reading known binary files
    const contentType = detectContentType(absolutePath);
    
    // Handle binary files
    if (contentType === ContentType.BINARY) {
      // Skip binary files if requested
      if (options.skipBinaryContent) {
        logger.debug(`Skipping binary file: ${absolutePath}`);
        return null;
      }
      
      // Check binary size limit
      const maxBinarySize = options.maxBinarySize ?? 10 * 1024 * 1024; // Default to 10MB
      if (fileSizeBytes > maxBinarySize) {
        logger.warn(`Binary file exceeds size limit: ${absolutePath} (${fileSizeBytes} bytes)`);
        
        // Create a placeholder item that references the file but doesn't include content
        const binaryItem = await BfContentItem.__DANGEROUS__createUnattached(
          cv,
          {
            title: slug,
            body: "", // Empty body for binary files
            slug,
            filePath: absolutePath,
            contentType: ContentType.BINARY,
            binarySize: fileSizeBytes,
            binaryPath: absolutePath,
          },
          { bfGid: pathToBfGid(absolutePath) },
          cache
        );
        
        // Create relationship between collection and item
        await BfEdge.createBetweenNodes(
          cv,
          collection,
          binaryItem,
          "contains",
          undefined,
          cache
        );
        
        return binaryItem;
      }
      
      // For smaller binary files, proceed with binary handling
      const binaryItem = await BfContentItem.__DANGEROUS__createUnattached(
        cv,
        {
          title: slug,
          body: "", // Empty body for binary files
          slug,
          filePath: absolutePath,
          contentType: ContentType.BINARY,
          binarySize: fileSizeBytes,
          binaryPath: absolutePath,
        },
        { bfGid: pathToBfGid(absolutePath) },
        cache
      );
      
      // Create relationship between collection and item
      await BfEdge.createBetweenNodes(
        cv,
        collection,
        binaryItem,
        "contains",
        undefined,
        cache
      );
      
      return binaryItem;
    }
    
    // For text files, read content
    const fileContent = await Deno.readTextFile(absolutePath);
    
    // Refine content type based on content if needed
    const refinedContentType = contentType === ContentType.UNKNOWN
      ? detectContentType(absolutePath, fileContent)
      : contentType;
    
    // Create the content item
    const contentItem = await BfContentItem.__DANGEROUS__createUnattached(
      cv,
      {
        title: slug,
        body: fileContent,
        slug,
        filePath: absolutePath,
        contentType: refinedContentType,
      },
      { bfGid: pathToBfGid(absolutePath) },
      cache
    );
    
    // Create relationship between collection and item
    await BfEdge.createBetweenNodes(
      cv,
      collection,
      contentItem,
      "contains",
      undefined,
      cache
    );
    
    return contentItem;
  } catch (error) {
    logger.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}
```

### 5. Enhanced Query Options

```typescript
/**
 * Extended query options for content items
 */
export type ContentQueryOptions = {
  cache?: BfNodeCache;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
};

/**
 * Queries content items with enhanced sorting and filtering
 * 
 * @param cv Current viewer for permission context
 * @param recursive Whether to include items from child collections
 * @param options Query options for sorting and filtering
 * @returns Array of content items
 */
async queryContentItems(
  cv: BfCurrentViewer,
  recursive: boolean = false,
  options: ContentQueryOptions = {}
): Promise<BfContentItem[]> {
  try {
    logger.debug(`Querying content items in collection ${this.props.name}, recursive: ${recursive}`, options);
    
    // Get items (reusing implementation from Phase 2)
    const items = await this._getContentItems(cv, recursive, options);
    
    // Apply filtering if specified
    let filteredItems = items;
    if (options.filter) {
      filteredItems = items.filter(item => {
        // Check each filter criterion
        for (const [key, value] of Object.entries(options.filter!)) {
          // Skip undefined values
          if (value === undefined) continue;
          
          // Handle properties that might not exist
          if (!(key in item.props)) return false;
          
          // Simple equality check for now (could be expanded for more complex filters)
          if (item.props[key] !== value) return false;
        }
        return true;
      });
    }
    
    // Apply sorting if specified
    if (options.sort) {
      const { field, order } = options.sort;
      filteredItems.sort((a, b) => {
        const aValue = a.props[field];
        const bValue = b.props[field];
        
        // Handle missing values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return order === "asc" ? -1 : 1;
        if (bValue === undefined) return order === "asc" ? 1 : -1;
        
        // Sort based on value type
        if (typeof aValue === "string" && typeof bValue === "string") {
          return order === "asc" 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Default comparison for numbers etc.
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    // Apply limit and offset
    if (options.offset !== undefined || options.limit !== undefined) {
      const offset = options.offset || 0;
      const limit = options.limit !== undefined ? options.limit : filteredItems.length;
      filteredItems = filteredItems.slice(offset, offset + limit);
    }
    
    logger.debug(`Found ${filteredItems.length} content items after filtering and sorting`);
    return filteredItems;
  } catch (error) {
    logger.error(`Error querying content items for collection ${this.metadata.bfGid}:`, error);
    throw new BfError(`Failed to query content items: ${error.message}`, { cause: error });
  }
}
```

### 6. File Move/Rename Detection

```typescript
/**
 * Detects and processes file renames/moves
 * 
 * @param cv Current viewer for permission context
 * @param moveData Array of old path to new path mappings
 * @param options Additional options
 * @returns Array of updated collections
 */
static async detectFileRenames(
  cv: BfCurrentViewer,
  moveData: Array<{ oldPath: string; newPath: string }>,
  options: {
    cache?: BfNodeCache;
  } = {}
): Promise<BfContentCollection[]> {
  logger.debug(`Processing ${moveData.length} file moves/renames`);
  
  const updatedCollections = new Set<BfContentCollection>();
  const cache = options.cache || new BfNodeCache();
  
  for (const { oldPath, newPath } of moveData) {
    try {
      const oldAbsolutePath = path.resolve(oldPath);
      const newAbsolutePath = path.resolve(newPath);
      
      const oldId = pathToBfGid(oldAbsolutePath);
      
      logger.debug(`Processing move: ${oldAbsolutePath} -> ${newAbsolutePath}`);
      
      // Find content item by its original ID
      const item = await BfContentItem.find(cv, oldId, cache);
      
      if (!item) {
        logger.debug(`No content item found for original path: ${oldAbsolutePath}`);
        continue;
      }
      
      // Find parent collection
      const sourceEdges = await BfEdge.querySourceEdges(cv, item.metadata.bfGid, { role: "contains" }, cache);
      
      if (sourceEdges.length === 0) {
        logger.debug(`No parent collection found for item: ${oldAbsolutePath}`);
        continue;
      }
      
      const parentId = sourceEdges[0].metadata.bfSid;
      const collection = await BfContentCollection.find(cv, parentId, cache);
      
      if (!collection) {
        logger.debug(`Failed to find parent collection with ID: ${parentId}`);
        continue;
      }
      
      // Check if file exists at new location
      const fileExists = await Deno.stat(newAbsolutePath)
        .then(() => true)
        .catch(() => false);
      
      if (!fileExists) {
        logger.debug(`Target file does not exist: ${newAbsolutePath}`);
        continue;
      }
      
      // Read new file content if it's not a directory
      const isDirectory = await Deno.stat(newAbsolutePath)
        .then(stat => stat.isDirectory)
        .catch(() => false);
      
      if (!isDirectory) {
        // Get new file name/slug
        const fileName = path.basename(newPath);
        const slug = path.basename(fileName, path.extname(fileName));
        
        // For text files, read the content
        const contentType = detectContentType(newAbsolutePath);
        
        if (contentType !== ContentType.BINARY) {
          const fileContent = await Deno.readTextFile(newAbsolutePath);
          
          // Update item properties but keep the same ID
          item.props.title = slug;
          item.props.slug = slug;
          item.props.body = fileContent;
          item.props.filePath = newAbsolutePath;
          item.props.contentType = contentType;
          
          await item.save();
        } else {
          // For binary files, just update metadata
          const stat = await Deno.stat(newAbsolutePath);
          
          item.props.title = slug;
          item.props.slug = slug;
          item.props.filePath = newAbsolutePath;
          item.props.contentType = ContentType.BINARY;
          item.props.binarySize = stat.size;
          item.props.binaryPath = newAbsolutePath;
          
          await item.save();
        }
        
        // Emit move event
        contentEvents.emit({
          type: ContentEventType.MOVED,
          contentId: item.metadata.bfGid,
          path: newAbsolutePath,
          collection,
          item,
        });
        
        updatedCollections.add(collection);
      } else {
        // Handle directory moves
        logger.debug(`Detected directory move: ${oldAbsolutePath} -> ${newAbsolutePath}`);
        
        // This is more complex - we might need to update the whole subtree
        // Implementation would depend on how we want to handle directory moves
        // For now, just indicate it needs special handling
        logger.info(`Directory moves require further processing: ${oldAbsolutePath} -> ${newAbsolutePath}`);
      }
    } catch (error) {
      logger.error(`Error processing move from ${oldPath} to ${newPath}:`, error);
    }
  }
  
  logger.debug(`Updated ${updatedCollections.size} collections due to file moves/renames`);
  return Array.from(updatedCollections);
}
```
