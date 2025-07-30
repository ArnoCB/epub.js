import Path from './path';

describe('Path', () => {
  it('Path()', () => {
    const p = new Path('/fred/chasen/derf.html');
    expect(p.path).toBe('/fred/chasen/derf.html');
    expect(p.directory).toBe('/fred/chasen/');
    expect(p.extension).toBe('html');
    expect(p.filename).toBe('derf.html');
  });

  it('Strip out url', () => {
    const p = new Path('http://example.com/fred/chasen/derf.html');
    expect(p.path).toBe('/fred/chasen/derf.html');
    expect(p.directory).toBe('/fred/chasen/');
    expect(p.extension).toBe('html');
    expect(p.filename).toBe('derf.html');
  });

  describe('#parse()', () => {
    it('should parse a path', () => {
      const parsed = Path.prototype.parse('/fred/chasen/derf.html');
      expect(parsed.dir).toBe('/fred/chasen');
      expect(parsed.base).toBe('derf.html');
      expect(parsed.ext).toBe('.html');
    });
    it('should parse a relative path', () => {
      const parsed = Path.prototype.parse('fred/chasen/derf.html');
      expect(parsed.dir).toBe('fred/chasen');
      expect(parsed.base).toBe('derf.html');
      expect(parsed.ext).toBe('.html');
    });
  });

  describe('#isDirectory()', () => {
    it('should recognize a directory', () => {
      expect(Path.prototype.isDirectory('/fred/chasen/')).toBe(true);
      expect(Path.prototype.isDirectory('/fred/chasen/derf.html')).toBe(false);
    });
  });

  describe('#resolve()', () => {
    it('should resolve a path', () => {
      const a = '/fred/chasen/index.html';
      const b = 'derf.html';
      const resolved = new Path(a).resolve(b);
      expect(resolved).toBe('/fred/chasen/derf.html');
    });
    it('should resolve a relative path', () => {
      const a = 'fred/chasen/index.html';
      const b = 'derf.html';
      const resolved = new Path(a).resolve(b);
      expect(resolved).toBe('/fred/chasen/derf.html');
    });
    it('should resolve a level up', () => {
      const a = '/fred/chasen/index.html';
      const b = '../derf.html';
      const resolved = new Path(a).resolve(b);
      expect(resolved).toBe('/fred/derf.html');
    });
  });

  describe('#relative()', () => {
    it('should find a relative path at the same level', () => {
      const a = '/fred/chasen/index.html';
      const b = '/fred/chasen/derf.html';
      const relative = new Path(a).relative(b);
      expect(relative).toBe('derf.html');
    });
    it('should find a relative path down a level', () => {
      const a = '/fred/chasen/index.html';
      const b = '/fred/chasen/ops/derf.html';
      const relative = new Path(a).relative(b);
      expect(relative).toBe('ops/derf.html');
    });
    it('should resolve a level up', () => {
      const a = '/fred/chasen/index.html';
      const b = '/fred/derf.html';
      const relative = new Path(a).relative(b);
      expect(relative).toBe('../derf.html');
    });
  });

  it('should parse a file path', () => {
    const p = new Path('/foo/bar/baz.txt');
    expect(p.directory).toBe('/foo/bar/');
    expect(p.filename).toBe('baz.txt');
    expect(p.extension).toBe('txt');
  });

  it('should parse a directory path', () => {
    const p = new Path('/foo/bar/');
    expect(p.directory).toBe('/foo/bar/');
    expect(p.filename).toBe('');
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

  it('should not prepend base directory for absolute paths in resolve()', () => {
    const base = '/fixtures/alice/OPS/';
    const abs = '/fixtures/alice/OPS/package.opf';
    const p = new Path(base);
    expect(() => p.resolve(abs)).toThrow(
      '[Path.resolve] Cannot resolve an absolute path: ' + abs
    );
  });

  it('should handle Windows path', () => {
    const p = new Path('C:\\foo\\bar\\baz.txt');
    expect(p.directory).toBe('C:/foo/bar/');
    expect(p.filename).toBe('baz.txt');
    expect(p.extension).toBe('txt');
  });

  it('should handle path with double slashes', () => {
    const p = new Path('/foo//bar//baz.txt');
    expect(p.directory).toBe('/foo/bar/');
    expect(p.filename).toBe('baz.txt');
    expect(p.extension).toBe('txt');
  });
});
