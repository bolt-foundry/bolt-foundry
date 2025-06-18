export function blogMetadata(
  author: string | null,
  publishedAt: string | null,
): string {
  const authorText = author ? `By ${author}` : "Someone";
  const date = publishedAt && new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));
  const publishedAtText = date ? `on ${date}` : "Published at an unknown date";
  return `${authorText} ${publishedAtText}`;
}
