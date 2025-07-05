import Url from '../../../src/utils/url';
describe('Url', () => {
  it('parses a url and uses path.resolve and path.relative', () => {
    const url = new Url('http://example.com/folder/file.txt');
    expect(url.directory).toBe('/folder/');
    expect(url.filename).toBe('file.txt');
    expect(url.extension).toBe('txt');
    expect(url.resolve('another.txt')).toMatch(/\/folder\/another\.txt$/);
    expect(typeof url.relative('folder/other.txt')).toBe('string');
  });
});
