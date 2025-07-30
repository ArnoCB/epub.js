import assert from 'assert';
import Path from '../src/utils/path';

describe('Core', function () {
  before(function () {});

  describe('Path', function () {
    it('Path()', function () {
      var path = new Path('/fred/chasen/derf.html');

      assert.equal(path.path, '/fred/chasen/derf.html');
      assert.equal(path.directory, '/fred/chasen/');
      assert.equal(path.extension, 'html');
      assert.equal(path.filename, 'derf.html');
    });

    it('Strip out url', function () {
      var path = new Path('http://example.com/fred/chasen/derf.html');

      assert.equal(path.path, '/fred/chasen/derf.html');
      assert.equal(path.directory, '/fred/chasen/');
      assert.equal(path.extension, 'html');
      assert.equal(path.filename, 'derf.html');
    });

    describe('#parse()', function () {
      it('should parse a path', function () {
        var path = Path.prototype.parse('/fred/chasen/derf.html');

        assert.equal(path.dir, '/fred/chasen');
        assert.equal(path.base, 'derf.html');
        assert.equal(path.ext, '.html');
      });

      it('should parse a relative path', function () {
        var path = Path.prototype.parse('fred/chasen/derf.html');

        assert.equal(path.dir, 'fred/chasen');
        assert.equal(path.base, 'derf.html');
        assert.equal(path.ext, '.html');
      });
    });

    describe('#isDirectory()', function () {
      it('should recognize a directory', function () {
        var directory = Path.prototype.isDirectory('/fred/chasen/');
        var notDirectory = Path.prototype.isDirectory('/fred/chasen/derf.html');

        assert(directory, '/fred/chasen/ is a directory');
        assert(!notDirectory, '/fred/chasen/derf.html is not directory');
      });
    });

    describe('#resolve()', function () {
      it('should resolve a path', function () {
        var a = '/fred/chasen/index.html';
        var b = 'derf.html';

        var resolved = new Path(a).resolve(b);
        assert.equal(resolved, '/fred/chasen/derf.html');
      });

      it('should resolve a relative path', function () {
        var a = 'fred/chasen/index.html';
        var b = 'derf.html';

        var resolved = new Path(a).resolve(b);
        assert.equal(resolved, '/fred/chasen/derf.html');
      });

      it('should resolve a level up', function () {
        var a = '/fred/chasen/index.html';
        var b = '../derf.html';

        var resolved = new Path(a).resolve(b);
        assert.equal(resolved, '/fred/derf.html');
      });
    });

    describe('#relative()', function () {
      it('should find a relative path at the same level', function () {
        var a = '/fred/chasen/index.html';
        var b = '/fred/chasen/derf.html';

        var relative = new Path(a).relative(b);
        assert.equal(relative, 'derf.html');
      });

      it('should find a relative path down a level', function () {
        var a = '/fred/chasen/index.html';
        var b = '/fred/chasen/ops/derf.html';

        var relative = new Path(a).relative(b);
        assert.equal(relative, 'ops/derf.html');
      });

      it('should resolve a level up', function () {
        var a = '/fred/chasen/index.html';
        var b = '/fred/derf.html';

        var relative = new Path(a).relative(b);
        assert.equal(relative, '../derf.html');
      });
    });
  });
});
