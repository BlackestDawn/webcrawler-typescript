import { JSDOM } from 'jsdom';
import pLimit, { LimitFunction } from 'p-limit';

export class ConcurrentCrawler {
  private baseURL: string;
  private limit: LimitFunction;
  private pages: Record<string, number> = {};

  constructor(url: string, maxConcurrency: number = 5) {
    this.baseURL = url;
    this.limit = pLimit(maxConcurrency);
    this.pages = {};
  }

  private addPageVisit(url: string): boolean {
    const normURL = normalizeURL(url);
    if (this.pages[normURL]) {
      this.pages[normURL]++;
      return false;
    }
    this.pages[normURL] = 1;
    return true;
  }

  private async getHTML(url: string): Promise<string> {
    return await this.limit(async () => {
      let response;
      try {
        response = await fetch(url);
      } catch (error) {
        throw new Error(`Got network error: ${(error as Error).message}`);
      }
      if (!response.ok) throw new Error(`Response from ${url} was not OK`);
      if (!response.headers.get('content-type')?.includes('text/html')) throw new Error(`Response from ${url} was not HTML`);
      const res = await response.text();
      return res;
    });
  }

  private async crawlPage(url: string) {
    if (!url.startsWith(this.baseURL)) return;
    if (!this.addPageVisit(url)) return;

    console.log(`Crawling page: ${url}`);
    let html =  '';
    try {
      html = await this.getHTML(url);
    } catch (error) {
      console.error(`Error crawling ${url}: ${(error as Error).message}`);
      return;
    }
    if (html) {
      const urls = getURLsFromHTML(html, this.baseURL)
      const urlPromises = urls.map(url => this.crawlPage(url));
      await Promise.all(urlPromises);
    }
  }

  async crawl() {
    await this.crawlPage(this.baseURL);
    return this.pages;
  }
}

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

export async function crawlSiteAsync(url: string) {
  const crawler = new ConcurrentCrawler(url, 2);
  const result = await crawler.crawl();
  return result;
}
