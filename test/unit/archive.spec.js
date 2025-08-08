const { expect } = require('chai');
const Archive = require('../../lib/archive').default;
const fs = require('fs');
const path = require('path');

describe('Archive', function () {
  let archive;

  beforeEach(function () {
    archive = new Archive();
  });

  afterEach(function () {
    if (archive) {
      archive.destroy();
    }
  });

  describe('Constructor and Requirements', function () {
    it('should create an Archive instance', function () {
      expect(archive).to.be.an.instanceof(Archive);
    });

    it('should have a zip property initialized', function () {
      // The zip property should be initialized in the constructor
      expect(archive.zip).to.not.be.undefined;
    });

    it('should throw an error if JSZip is not available', function () {
      // Mock the global JSZip to be undefined
      const originalJSZip = global.JSZip;
      global.JSZip = undefined;

      expect(() => {
        new Archive();
      }).to.throw('JSZip lib not loaded');

      // Restore JSZip
      global.JSZip = originalJSZip;
    });
  });

  describe('File Operations', function () {
    let epubBuffer;

    before(function () {
      // Load the test EPUB file
      const epubPath = path.join(__dirname, '../fixtures/alice.epub');
      epubBuffer = fs.readFileSync(epubPath);
    });

    it('should open an EPUB archive', async function () {
      const result = await archive.open(epubBuffer.buffer, false);
      expect(result).to.not.be.undefined;
      expect(typeof result).to.equal('object');
    });

    it('should retrieve text content from archive', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Try to get the container.xml file which should exist in any EPUB
      const containerText = await archive.getText('/META-INF/container.xml');
      expect(containerText).to.be.a('string');
      expect(containerText).to.include('container');
    });

    it('should retrieve blob content from archive', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Try to get the container.xml file as a blob
      const containerBlob = await archive.getBlob('/META-INF/container.xml');
      expect(containerBlob).to.be.an.instanceof(Blob);
      expect(containerBlob.size).to.be.greaterThan(0);
    });

    it('should retrieve base64 content from archive', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Try to get the container.xml file as base64
      const containerBase64 = await archive.getBase64(
        '/META-INF/container.xml'
      );
      expect(containerBase64).to.be.a('string');
      expect(containerBase64).to.match(/^data:.*base64,/);
    });

    it('should handle request with different types', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Test XML request
      const xmlContent = await archive.request(
        '/META-INF/container.xml',
        'xml'
      );
      expect(xmlContent).to.not.be.undefined;

      // Test string request
      const stringContent = await archive.request(
        '/META-INF/container.xml',
        'string'
      );
      expect(stringContent).to.be.a('string');
    });

    it('should create and manage URLs for archived content', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Create a URL for the container file
      const url = await archive.createUrl('/META-INF/container.xml');
      expect(url).to.be.a('string');
      expect(url).to.match(/^blob:/);

      // Check that it's cached
      const cachedUrl = await archive.createUrl('/META-INF/container.xml');
      expect(cachedUrl).to.equal(url);

      // Revoke the URL
      archive.revokeUrl('/META-INF/container.xml');
    });

    it('should create base64 URLs when requested', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Create a base64 URL
      const base64Url = await archive.createUrl('/META-INF/container.xml', {
        base64: true,
      });
      expect(base64Url).to.be.a('string');
      expect(base64Url).to.match(/^data:.*base64,/);
    });

    it('should handle missing files gracefully', async function () {
      await archive.open(epubBuffer.buffer, false);

      try {
        await archive.getText('/nonexistent/file.txt');
        expect.fail('Should have thrown an error for missing file');
      } catch (error) {
        expect(error.message).to.include('File not found in the epub');
      }
    });

    it('should destroy archive and clean up resources', async function () {
      await archive.open(epubBuffer.buffer, false);

      // Create a URL to test cleanup
      const url = await archive.createUrl('/META-INF/container.xml');
      expect(url).to.be.a('string');

      // Destroy the archive
      archive.destroy();

      // Verify cleanup
      expect(archive.zip).to.be.undefined;
      expect(Object.keys(archive.urlCache)).to.have.length(0);
    });
  });

  describe('Error Handling', function () {
    it('should throw error when trying to use destroyed archive', function () {
      archive.destroy();

      expect(() => {
        archive.getZip();
      }).to.throw('Archive has been destroyed or not initialized');
    });

    it('should handle invalid archive data', async function () {
      const invalidData = new ArrayBuffer(10);

      try {
        await archive.open(invalidData, false);
        expect.fail('Should have thrown an error for invalid archive data');
      } catch (error) {
        expect(error).to.not.be.undefined;
      }
    });
  });
});
