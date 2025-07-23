import Path from './path';
// const Path = require('./path.legacy.js'); // Use CommonJS syntax for legacy code
describe('Path (legacy JS)', () => {
  it('should parse a file path', () => {
    const p = new Path('/foo/bar/baz.txt');
    expect(p.directory).toBe('/foo/bar/');
    expect(p.filename).toBe('baz.txt');
    expect(p.extension).toBe('txt');
  });

  it('should parse a directory path', () => {
    const p = new Path('/foo/bar/');
    expect(p.directory).toBe('/foo/bar/');
    expect(p.filename).toBe('bar');
    expect(p.extension).toBe('');
  });

  it('should handle absolute URLs', () => {
    const p = new Path('https://example.com/foo/bar.txt');
    expect(p.directory).toBe('/foo/');
    expect(p.filename).toBe('bar.txt');
    expect(p.extension).toBe('txt');
  });

  it('should resolve a relative path', () => {
    const p = new Path('/foo/bar/');
    expect(p.resolve('baz.txt')).toBe('/foo/bar/baz.txt');
  });

  it('should resolve a path relative to the directory', () => {
    const p = new Path('/foo/bar/');
    expect(p.relative('/foo/bar/baz.txt')).toBe('baz.txt');
  });

  it('should return the path string with toString()', () => {
    const p = new Path('/foo/bar/baz.txt');
    expect(p.toString()).toBe('/foo/bar/baz.txt');
  });

  // Edge cases
  it('should handle root path', () => {
    const p = new Path('/');
    expect(p.directory).toBe('/');
    expect(p.filename).toBe('');
    expect(p.extension).toBe('');
  });

  it('should handle empty string', () => {
    const p = new Path('');
    expect(p.directory).toBe('/'); // path-webpack returns '/' for empty
    expect(p.filename).toBe('');
    expect(p.extension).toBe('');
  });

  it('should handle file URL', () => {
    const p = new Path('file:///foo/bar/baz.txt');
    expect(p.directory).toBe('/foo/bar/');
    expect(p.filename).toBe('baz.txt');
    expect(p.extension).toBe('txt');
  });

  it('should handle Windows path', () => {
    const p = new Path('C:\\foo\\bar\\baz.txt');
    // path-webpack returns '/' for directory in this case
    expect(p.directory).toBe('/');
    expect(p.filename).toBe('C:\\foo\\bar\\baz.txt');
    expect(p.extension).toBe('txt');
  });

  it('should handle path with double slashes', () => {
    const p = new Path('/foo//bar//baz.txt');
    expect(p.directory).toBe('/foo//bar//');
    expect(p.filename).toBe('baz.txt');
    expect(p.extension).toBe('txt');
  });
});
