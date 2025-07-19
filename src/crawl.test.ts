import { describe, it, expect } from 'vitest';
import { normalizeURL } from './crawl';

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