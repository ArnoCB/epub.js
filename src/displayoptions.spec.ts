import DisplayOptions from './displayoptions';

describe('DisplayOptions', () => {
  function createMockXml(
    options: Array<{ name: string; value: string }>
  ): XMLDocument {
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
      <display_options>
        ${options.map((opt) => `<option name="${opt.name}">${opt.value}</option>`).join('')}
      </display_options>`;
    return new window.DOMParser().parseFromString(xmlString, 'text/xml');
  }

  it('parses all display options', () => {
    const xml = createMockXml([
      { name: 'interactive', value: 'true' },
      { name: 'fixed-layout', value: 'false' },
      { name: 'open-to-spread', value: 'auto' },
      { name: 'orientation-lock', value: 'landscape' },
    ]);
    const opts = new DisplayOptions(xml);
    expect(opts.interactive).toBe('true');
    expect(opts.fixedLayout).toBe('false');
    expect(opts.openToSpread).toBe('auto');
    expect(opts.orientationLock).toBe('landscape');
  });

  it('handles missing options gracefully', () => {
    const xml = createMockXml([]);
    const opts = new DisplayOptions(xml);
    expect(opts.interactive).toBe('');
    expect(opts.fixedLayout).toBe('');
    expect(opts.openToSpread).toBe('');
    expect(opts.orientationLock).toBe('');
  });

  it('can be destroyed', () => {
    const xml = createMockXml([{ name: 'interactive', value: 'true' }]);
    const opts = new DisplayOptions(xml);
    opts.destroy();
    expect(opts.interactive).toBeUndefined();
    expect(opts.fixedLayout).toBeUndefined();
    expect(opts.openToSpread).toBeUndefined();
    expect(opts.orientationLock).toBeUndefined();
  });
});
