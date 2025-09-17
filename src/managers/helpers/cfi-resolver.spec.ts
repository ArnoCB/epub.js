import { CfiResolver } from './cfi-resolver';

describe('CfiResolver', () => {
  test('returns CFI from descendant text node when available', async () => {
    const resolver = new CfiResolver();
    const doc = document.implementation.createHTMLDocument('test');
    const el = doc.createElement('div');
    const p = doc.createElement('p');
    p.textContent = 'Hello world';
    el.appendChild(p);
    doc.body.appendChild(el);

    const section: any = {
      href: 'chapter.xhtml',
      cfiFrom: jest.fn().mockReturnValue('descendant-cfi'),
    };

    const res = await resolver.resolveForElement(doc, section, el);
    expect(res!.cfi!).toBe('descendant-cfi');
  });

  test('falls back to elementRange when no text descendant', async () => {
    const resolver = new CfiResolver();
    const doc = document.implementation.createHTMLDocument('test2');
    const el = doc.createElement('div');
    doc.body.appendChild(el);

    const section: any = {
      href: 'chapter2.xhtml',
      cfiFrom: jest.fn().mockReturnValue('elementRange-cfi'),
    };

    const res = await resolver.resolveForElement(doc, section, el);
    expect(res.cfi).toBe('elementRange-cfi');
  });

  test('falls back to previous text node when present', async () => {
    const resolver = new CfiResolver();
    const doc = document.implementation.createHTMLDocument('test4');
    const sibling = doc.createElement('p');
    sibling.textContent = 'previous text node';
    const el = doc.createElement('div');
    doc.body.appendChild(sibling);
    doc.body.appendChild(el);

    // Mock cfiFrom so it returns a CFI when the range.startContainer contains the previous text
    const mockCfiFromRange = jest.fn((range: any) => {
      const n = range.startContainer as Node | undefined;
      if (n && n.nodeValue && n.nodeValue.indexOf('previous') !== -1)
        return 'prev-cfi';
      return undefined;
    });

    const section: any = {
      href: 'chapter4.xhtml',
      cfiFrom: mockCfiFromRange,
    };

    const res = await resolver.resolveForElement(doc, section, el);
    expect(res.cfi).toBe('prev-cfi');
  });
});
