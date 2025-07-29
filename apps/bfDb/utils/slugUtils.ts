/**
 * Utilities for generating and validating URL-safe slugs
 */

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a deck slug with organization scope
 */
export function generateDeckSlug(deckName: string, orgId: string): string {
  const cleanName = slugify(deckName);
  return `${orgId}_${cleanName}`;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 200;
}

/**
 * Validate deck slug format (includes org prefix)
 */
export function isValidDeckSlug(slug: string): boolean {
  const deckSlugPattern = /^[a-z0-9]+_[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return deckSlugPattern.test(slug) && slug.length > 0 && slug.length <= 200;
}
