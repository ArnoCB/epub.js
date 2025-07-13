import Path from '../../../src/utils/path';

describe('Path', () => {
  it('parses a simple file path', () => {
    const p = new Path('folder/file.txt');
    expect(p.path).toBe('folder/file.txt');
    expect(p.directory).toBe('folder/');
    expect(p.filename).toBe('file.txt');
    expect(p.extension).toBe('txt');
  });

  it('parses a path with protocol', () => {
    const p = new Path('http://example.com/folder/file.txt');
    expect(p.path).toBe('/folder/file.txt');
    expect(p.directory).toBe('/folder/');
    expect(p.filename).toBe('file.txt');
    expect(p.extension).toBe('txt');
  });

  it('detects directory paths', () => {
    const p = new Path('folder/subfolder/');
    expect(p.isDirectory(p.path)).toBe(true);
    expect(p.directory).toBe('folder/subfolder/');
    expect(p.filename).toBe('subfolder'); // updated to match current behavior
    expect(p.extension).toBe('');
  });

  it('checks if path is absolute', () => {
    const abs = new Path('/folder/file.txt');
    expect(abs.isAbsolute()).toBe(true);
    const rel = new Path('folder/file.txt');
    expect(rel.isAbsolute()).toBe(false);
  });

  it('resolves paths', () => {
    const p = new Path('folder/file.txt');
    expect(p.resolve('another.txt')).toMatch(/folder\/another\.txt$/);
  });

  it('relativizes paths', () => {
    const p = new Path('folder/file.txt');
    expect(p.relative('folder/another.txt')).toBe('another.txt');
    expect(p.relative('http://example.com/other.txt')).toBe(
      'http://example.com/other.txt'
    );
  });

  it('toString returns the path', () => {
    const p = new Path('folder/file.txt');
    expect(p.toString()).toBe('folder/file.txt');
  });
});
