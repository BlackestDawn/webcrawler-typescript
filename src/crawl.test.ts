import { describe, it, expect } from 'vitest';
import { getURLsFromHTML, normalizeURL } from './crawl.js';

describe('normalizeURL', () => {
  it('should strip the protocol from the URL', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
  });

  it('should remove trailing slashes', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
  });

  it('should handle capitals in the domain', () => {
    const input = 'https://BLOG.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
  });

  it('should strip http protocol', () => {
    const input = 'http://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
  });

  it('should handle query parameters', () => {
    const input = 'https://blog.boot.dev/path?q=123';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toBe(expected);
  });
});

describe('getURLsFromHTML', () => {
  it('should get absolute URLs from HTML body', () => {
    const htmlBody = `
      <html>
        <body>
          <a href="https://blog.boot.dev/path/"><span>Go to Boot.dev</span></a>
        </body>
      </html>
    `;
    const baseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected);
  });

  it('should get relative URLs from HTML body', () => {
    const htmlBody = `
      <html>
        <body>
          <a href="/path/one"><span>Path One</span></a>
          <a href="path/two"><span>Path Two</span></a>
        </body>
      </html>
    `;
    const baseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['https://blog.boot.dev/path/one', 'https://blog.boot.dev/path/two'];
    expect(actual.sort()).toEqual(expected.sort());
  });

  it('should get both absolute and relative URLs', () => {
    const htmlBody = `
      <html>
        <body>
          <a href="https://blog.boot.dev/path1/"><span>Path One</span></a>
          <a href="/path2/"><span>Path Two</span></a>
        </body>
      </html>
    `;
    const baseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/'];
    expect(actual.sort()).toEqual(expected.sort());
  });

  it('should not include javascript invokation', () => {
    const htmlBody = `
      <html>
        <body>
          <a href="javascript:void(0);"><span>Invalid URL</span></a>
        </body>
      </html>
    `;
    const baseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(htmlBody, baseURL);
    const expected: string[] = [];
    expect(actual).toEqual(expected);
  });
});