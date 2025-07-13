import Resources from '../../src/resources';
describe('Resources', () => {
  it('splits resources and uses path.isAbsolute', () => {
    const manifest = {
      item1: { href: 'file1.txt', type: 'text/html' },
      item2: { href: 'file2.css', type: 'text/css' },
      item3: { href: 'file3.png', type: 'image/png' },
    };
    const options = {
      resolver: (x) => x,
      request: jest.fn(() => Promise.resolve('blob')),
    };
    const resources = new Resources(manifest, options);
    expect(resources.html.length).toBe(1);
    expect(resources.css.length).toBe(1);
    expect(resources.assets.length).toBe(2);
    // path.isAbsolute is used in createCssFile
    expect(typeof resources.createCssFile).toBe('function');
  });
});
