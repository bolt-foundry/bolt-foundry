import { join } from "@std/path";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export interface BlogPost {
  filename: string;
  slug: string;
  title: string;
}

/**
 * Reads all blog posts from the docs/blog directory
 * @returns Array of blog post metadata
 */
export async function getAvailableBlogPosts(): Promise<Array<BlogPost>> {
  const blogDir = join(Deno.cwd(), "docs", "blog");
  const posts: Array<BlogPost> = [];

  try {
    for await (const entry of Deno.readDir(blogDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        const slug = entry.name.replace(".md", "");

        // Read the file to extract the title
        const filepath = join(blogDir, entry.name);
        const content = await Deno.readTextFile(filepath);

        // Extract title from the first H1 heading
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : slug;

        posts.push({
          filename: entry.name,
          slug,
          title,
        });
      }
    }
  } catch (error) {
    logger.error("Error reading blog directory:", error);
  }

  // Sort posts by filename (which includes date) in descending order
  posts.sort((a, b) => b.filename.localeCompare(a.filename));

  return posts;
}

/**
 * Gets a random blog post from the available posts
 * @returns A random blog post or undefined if no posts exist
 */
export async function getRandomBlogPost(): Promise<BlogPost | undefined> {
  const posts = await getAvailableBlogPosts();
  if (posts.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * posts.length);
  return posts[randomIndex];
}

/**
 * Gets the most recent blog post
 * @returns The most recent blog post or undefined if no posts exist
 */
export async function getMostRecentBlogPost(): Promise<BlogPost | undefined> {
  const posts = await getAvailableBlogPosts();
  return posts[0]; // Already sorted in descending order
}
