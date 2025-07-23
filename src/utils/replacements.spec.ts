// No jsdom import needed; Jest provides a jsdom environment
import {
  replaceBase,
  replaceCanonical,
  replaceMeta,
  replaceLinks,
  substitute,
  Section,
} from './replacements';

describe('replacements', () => {
  let doc: Document;

  beforeEach(() => {
    // Reset the document for each test
    document.documentElement.innerHTML = '<head></head><body></body>';
    doc = document;
  });

  it('replaceBase sets <base> href', () => {
    const section: Section = { url: '/test.html' };
    replaceBase(doc, section);
    const base = doc.querySelector('base');
    expect(base).not.toBeNull();
    expect(base!.getAttribute('href')).toContain('/test.html');
  });

  it('replaceCanonical sets <link rel="canonical">', () => {
    const section: Section = { canonical: 'https://example.com/page' };
    replaceCanonical(doc, section);
    const link = doc.querySelector("link[rel='canonical']");
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('https://example.com/page');
  });

  it('replaceMeta sets <meta name="dc.identifier">', () => {
    const section: Section = { idref: 'id-123' };
    replaceMeta(doc, section);
    const meta = doc.querySelector("meta[name='dc.identifier']");
    expect(meta).not.toBeNull();
    expect(meta!.getAttribute('content')).toBe('id-123');
  });

  it('replaceLinks sets target and onclick', () => {
    const section: Section = { url: '/base.html' };
    replaceBase(doc, section);
    const a = doc.createElement('a');
    a.setAttribute('href', '/foo/bar');
    doc.body.appendChild(a);
    let called = '';
    replaceLinks(doc.body, (href) => {
      called = href;
    });
    expect(a.getAttribute('target')).toBeNull();
    a.onclick!(new MouseEvent('click'));
    expect(called).toContain('/foo/bar');
  });

  it('substitute replaces all urls', () => {
    const content = 'foo bar baz';
    const urls = ['bar', 'baz'];
    const replacements = ['BAR', 'BAZ'];
    const result = substitute(content, urls, replacements);
    expect(result).toBe('foo BAR BAZ');
  });
});
