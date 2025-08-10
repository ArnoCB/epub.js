import Container from './container';

describe('Container', () => {
  it('parses container XML and uses path.dirname', () => {
    const mockRootfile = { getAttribute: jest.fn(() => 'OPS/package.opf') };
    const mockDoc = {
      querySelector: jest.fn(() => mockRootfile),
    } as unknown as XMLDocument;

    const container = new Container(mockDoc);
    expect(container.packagePath).toBe('OPS/package.opf');
    expect(container.directory).toBe('OPS/'); // directories end with trailing slash
  });
});
