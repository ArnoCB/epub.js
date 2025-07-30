import Url from './url';

describe('Url parsing', () => {
  it('should parse an absolute URL', () => {
    const url = new Url('https://example.com/foo/bar.html');
    expect(url.href).toBe('https://example.com/foo/bar.html');
    expect(url.protocol).toBe('https:');
    expect(url.origin).toBe('https://example.com');
    expect(url.filename).toBe('bar.html');
    expect(url.extension).toBe('html');
  });

  it('should parse a relative URL with base', () => {
    const url = new Url('foo/bar.html', 'https://example.com/baz/');
    expect(url.href).toBe('https://example.com/baz/foo/bar.html');
    expect(url.protocol).toBe('https:');
    expect(url.origin).toBe('https://example.com');
    expect(url.filename).toBe('bar.html');
    expect(url.extension).toBe('html');
  });

  it('should resolve a relative path', () => {
    const url = new Url('https://example.com/foo/bar.html');
    expect(url.resolve('baz/qux.txt')).toBe(
      'https://example.com/foo/baz/qux.txt'
    );
  });

  it('should return absolute path as-is in resolve()', () => {
    const url = new Url('https://example.com/foo/bar.html');
    expect(url.resolve('https://other.com/x/y')).toBe('https://other.com/x/y');
  });

  it('should expose toString() as href', () => {
    const url = new Url('https://example.com/foo/bar.html');
    expect(url.toString()).toBe('https://example.com/foo/bar.html');
  });

  it('should parse hash and search', () => {
    const url = new Url('https://example.com/foo/bar.html?x=1#frag');
    expect(url.hash).toBe('#frag');
    expect(url.search).toBe('?x=1');
  });

  it('should handle missing base gracefully', () => {
    const url = new Url('foo/bar.html');
    expect(url.filename).toBe('bar.html');
    expect(url.extension).toBe('html');
  });

  it('should handle empty string input gracefully', () => {
    expect(() => new Url('')).not.toThrow();
    // Note: legacy code does not support null input in strict TypeScript
    // Future implementations should match legacy behavior for empty string
  });

  it('should not prepend base directory for absolute paths in resolve()', () => {
    const base = 'https://example.com/fixtures/alice/OPS/';
    const abs = '/fixtures/alice/OPS/package.opf';
    const url = new Url(base);
    expect(url.resolve(abs)).toBe(
      'https://example.com/fixtures/alice/OPS/package.opf'
    );
  });
});
