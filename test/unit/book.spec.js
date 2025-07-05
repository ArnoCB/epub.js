import Path from '../../src/utils/path';
import path from 'path-webpack';

describe('Path (unit, path-webpack)', () => {
  test('parses a simple file path', () => {
    const p = new Path('folder/file.txt');
    expect(p.path).toBe('folder/file.txt');
    expect(p.directory).toBe('folder/');
    expect(p.filename).toBe('file.txt');
    expect(p.extension).toBe('txt');
  });

  test('parses a path with protocol', () => {
    const p = new Path('http://example.com/folder/file.txt');
    expect(p.path).toBe('/folder/file.txt');
    expect(p.directory).toBe('/folder/');
    expect(p.filename).toBe('file.txt');
    expect(p.extension).toBe('txt');
  });

  test('isDirectory uses trailing slash', () => {
    const p = new Path('folder/subfolder/');
    expect(p.isDirectory(p.path)).toBe(true);
    expect(p.directory).toBe('folder/subfolder/');
    expect(p.filename).toBe('subfolder');
    expect(p.extension).toBe('');
  });

  test('isAbsolute uses path-webpack', () => {
    expect(path.isAbsolute('/folder/file.txt')).toBe(true);
    expect(path.isAbsolute('folder/file.txt')).toBe(false);
  });

  test('parse uses path-webpack', () => {
    const p = new Path('folder/file.txt');
    const parsed = p.parse('folder/file.txt');
    expect(parsed.base).toBe('file.txt');
    expect(parsed.dir).toBe('folder');
    expect(parsed.ext).toBe('.txt');
  });

  test('resolve uses path-webpack', () => {
    const p = new Path('folder/file.txt');
    expect(p.resolve('another.txt')).toMatch(/folder\/another\.txt$/);
  });

  test('relative uses path-webpack', () => {
    const p = new Path('folder/file.txt');
    expect(p.relative('folder/another.txt')).toBe('another.txt');
    expect(p.relative('http://example.com/other.txt')).toBe('http://example.com/other.txt');
  });

  test('toString returns the path', () => {
    const p = new Path('folder/file.txt');
    expect(p.toString()).toBe('folder/file.txt');
  });
});

describe('Path (edge cases)', () => {
  test('handles empty string', () => {
    const p = new Path('');
    expect(p.path).toBe('');
    expect(p.directory).toBe('/');
    expect(p.filename).toBe('');
    expect(p.extension).toBe('');
  });

  test('handles null and undefined', () => {
    expect(() => new Path(null)).toThrow();
    expect(() => new Path(undefined)).toThrow();
  });

  test('handles multiple slashes', () => {
    const p = new Path('folder//file.txt');
    expect(p.directory).toMatch(/folder\/?/);
    expect(p.filename).toBe('file.txt');
  });

  test('handles . and .. segments', () => {
    const p = new Path('folder/../file.txt');
    expect(p.filename).toBe('file.txt');
    // Directory may depend on implementation
  });

  test('handles no extension and multiple dots', () => {
    const p1 = new Path('folder/file');
    expect(p1.extension).toBe('');
    const p2 = new Path('folder/file.tar.gz');
    expect(p2.extension).toBe('gz');
  });

  test('handles special characters and spaces', () => {
    const p = new Path('folder/fi le@!.txt');
    expect(p.filename).toBe('fi le@!.txt');
    expect(p.extension).toBe('txt');
  });

  test('resolve and relative with root and unrelated dirs', () => {
    const p = new Path('/folder/file.txt');
    expect(p.resolve('/other/another.txt')).toMatch(/\/other\/another\.txt$/);
    expect(typeof p.relative('/unrelated/other.txt')).toBe('string');
  });

  test('handles Windows-style paths', () => {
    const p = new Path('C:/folder/file.txt');
    expect(p.filename).toBe('file.txt');
    expect(p.directory).toMatch(/C:\/?folder\/?/);
  });

  test('handles URLs with query and hash', () => {
    const p = new Path('/folder/file.txt?foo=bar#baz');
    expect(p.filename).toMatch(/file.txt/);
  });
});
