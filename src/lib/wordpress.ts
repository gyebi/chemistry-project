export function normalizeWordPressUrl(
  url?: string
): string | undefined {
  if (!url) return undefined;

  const publicBase =
    process.env.WORDPRESS_API_URL ?? "http://localhost:8080";

  return url
    .replace("http://localhost:8080", publicBase)
    .replace("https://localhost:8080", publicBase);
}
