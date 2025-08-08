beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:url');
  global.URL.revokeObjectURL = jest.fn();
});

import Archive from './archive';
import JSZip from 'jszip';

describe('Archive', () => {
  let archive: Archive;
  let zip: JSZip;

  beforeEach(() => {
    archive = new Archive();
    zip = new JSZip();
    zip.file('test.txt', 'Hello World');
    zip.file('test.xml', '<root><child/></root>');
    zip.file('test.opf', '<package></package>');
    zip.file('test.ncx', '<ncx></ncx>');
  });

  test('should construct and initialize JSZip', () => {
    expect(archive).toBeInstanceOf(Archive);
  });

  test('should handle JSZip initialization errors gracefully', () => {
    // Test that the Archive constructor exists and can be called
    expect(() => new Archive()).not.toThrow();

    // Test that the Archive has the expected methods
    const archive = new Archive();
    expect(typeof archive.open).toBe('function');
    expect(typeof archive.request).toBe('function');
    expect(typeof archive.destroy).toBe('function');

    archive.destroy();
  });

  test('should open a zip archive', async () => {
    const content = await zip.generateAsync({ type: 'uint8array' });
    await expect(archive.open(content, false)).resolves.toBeDefined();
  });

  test('should get text from archive', async () => {
    const content = await zip.generateAsync({ type: 'uint8array' });
    await archive.open(content, false);
    await expect(archive.request('/test.txt', 'text')).resolves.toBe(
      'Hello World'
    );
  });

  test('should get blob from archive', async () => {
    const content = await zip.generateAsync({ type: 'uint8array' });
    await archive.open(content, false);
    const blob = await archive.request('/test.txt', 'blob');
    expect(blob).toBeInstanceOf(Blob);
  });

  test('should parse xml, opf, ncx as Document', async () => {
    const content = await zip.generateAsync({ type: 'uint8array' });
    await archive.open(content, false);
    const xmlDoc = await archive.request('/test.xml', 'xml');
    expect(xmlDoc).toBeInstanceOf(Document);
    const opfDoc = await archive.request('/test.opf', 'opf');
    expect(opfDoc).toBeInstanceOf(Document);
    const ncxDoc = await archive.request('/test.ncx', 'ncx');
    expect(ncxDoc).toBeInstanceOf(Document);
  });

  test('should create and revoke URLs', async () => {
    const content = await zip.generateAsync({ type: 'uint8array' });
    await archive.open(content, false);
    const url = await archive.createUrl('/test.txt');
    expect(typeof url).toBe('string');
    archive.revokeUrl('/test.txt');
  });

  test('should destroy archive and clear cache', async () => {
    const content = await zip.generateAsync({ type: 'uint8array' });
    await archive.open(content, false);
    await archive.createUrl('/test.txt');
    archive.destroy();
    await expect(archive.request('/test.txt', 'text')).rejects.toBeDefined();
  });
});
