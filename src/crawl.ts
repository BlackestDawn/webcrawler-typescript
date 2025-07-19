import { JSDOM } from 'jsdom';

export function normalizeURL(url: string): string {
  let normalizedURL = new URL(url.toLowerCase());
  return (`${normalizedURL.hostname}${normalizedURL.pathname}`).replace(/\/+$/, '');
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  const urls: string[] = [];
  const links = dom.window.document.querySelectorAll('a');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (href) {
      const url = new URL(href, baseURL);
      if (url.protocol === 'javascript:') continue;
      urls.push(url.toString());
    }
  }
  return urls;
}

export async function getHTML(url: string) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Got network error: ${(error as Error).message}`);
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  if (!response.headers.get('content-type')?.includes('text/html')) {
    throw new Error(`Response from ${url} is not HTML`);
  }
  console.log(await response.text());
}
