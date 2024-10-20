export function sanitizeFilename(filename: string) {
  return filename
    .replace(/[/\\?%*:|"<>]/g, "-") // Replace forbidden characters globally
    .replace(/\s+/g, "_") // Replace whitespace globally
    .replace(/&/g, "and") // Replace '&' globally
    .replace(/[^0-9a-z_\-]/gi, "") // Remove any characters that are not alphanumeric, underscore or hyphen
    .toLowerCase(); // Convert the entire string to lowercase
}

export function formatDateString(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
