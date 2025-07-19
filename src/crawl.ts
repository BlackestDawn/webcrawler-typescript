export function normalizeURL(url: string): string {
  let normalizedURL = new URL(url.toLowerCase());
  return (`${normalizedURL.hostname}${normalizedURL.pathname}`).replace(/\/+$/, '');
}
