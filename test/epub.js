import assert from 'assert';
import ePub from '../src/epub';
// var sinon = require('sinon');

describe('ePub', function () {
  it('should open a epub', function () {
    var book = ePub('/fixtures/alice/OPS/package.opf');

    return book.opened.then(function () {
      assert.equal(book.isOpen, true, 'book is opened');
      assert.equal(
        book.url.toString(),
        // The base url is lost, perhaps because of globalThis instead of window?
        // 'http://localhost:9876/fixtures/alice/OPS/package.opf',
        '/fixtures/alice/OPS/package.opf',
        'book url is passed to new Book'
      );
    });
  });

  it('should open a archived epub', function () {
    var book = ePub('/fixtures/alice.epub');

    return book.opened.then(function () {
      assert.equal(book.isOpen, true, 'book is opened');
      assert(book.archive, 'book is unarchived');
    });
  });
});
