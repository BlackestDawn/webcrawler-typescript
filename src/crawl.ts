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
    console.log(`Response from ${url} was not OK`);
    return;
  };
  if (!response.headers.get('content-type')?.includes('text/html')) {
    console.log(`Response from ${url} was not HTML`);
    return;
  }
  const res = await response.text();
  return res;
}

export async function crawlPage(baseURL: string, currentURL: string, pages: Record<string, number> = {}) {
  console.log(`Crawling page: ${currentURL}`);

  if (!currentURL.startsWith(baseURL)) return pages;
  const normURL = normalizeURL(currentURL);
  if (pages[normURL]) {
    pages[normURL]++;
    return pages;
  }
  pages[normURL] = 1;
  const html = await getHTML(currentURL);
  if (!html) return pages;
  const urls = getURLsFromHTML(html, baseURL);
  for (const url of urls) {
    await crawlPage(baseURL, url, pages);
  }
  return pages;
}
