import Container from '../../src/container';
import * as core from '../../src/utils/core';

describe('Container', () => {
  it('parses container XML and uses path.dirname', () => {
    const mockRootfile = { getAttribute: jest.fn(() => 'OPS/package.opf') };
    const mockDoc = {
      xmlEncoding: 'utf-8',
    };
    jest.spyOn(core, 'qs').mockReturnValue(mockRootfile);
    const container = new Container(mockDoc);
    expect(container.packagePath).toBe('OPS/package.opf');
    expect(container.directory).toBe('OPS');
    expect(container.encoding).toBe('utf-8');
    core.qs.mockRestore();
  });
});
