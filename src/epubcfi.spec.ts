import EpubCFI from './epubcfi';

describe('EpubCFI CustomRange support', () => {
  it('should accept a CustomRange object', () => {
    // Attach node to DOM so pathTo works
    const node = document.createElement('span');
    node.textContent = 'hello world';
    document.body.appendChild(node);
    const customRange = {
      startContainer: node,
      startOffset: 0,
      endContainer: node,
      endOffset: 5,
    };

    const cfi = new EpubCFI(customRange as any);
    expect(cfi).toBeInstanceOf(EpubCFI);
    expect(cfi.range).toBe(true);
    expect(cfi.start).not.toBeNull();
    expect(cfi.end).not.toBeNull();

    // Clean up
    document.body.removeChild(node);
  });
});

describe('EpubCFI', () => {
  describe('EpubCFI (legacy parity)', () => {
    it('parse a cfi on init', () => {
      const cfi = new EpubCFI('epubcfi(/6/2[cover]!/6)');
      expect(cfi.spinePos).toBe(0);
    });

    it('parse a cfi and ignore the base if present', () => {
      const cfi = new EpubCFI('epubcfi(/6/2[cover]!/6)', '/6/6[end]');
      expect(cfi.spinePos).toBe(0);
    });

    describe('#toString()', () => {
      it('parse a cfi and write it back', () => {
        expect(new EpubCFI('epubcfi(/6/2[cover]!/6)').toString()).toBe(
          'epubcfi(/6/2[cover]!/6)'
        );
        expect(
          new EpubCFI(
            'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
          ).toString()
        ).toBe('epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)');
        expect(
          new EpubCFI(
            'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)'
          ).toString()
        ).toBe('epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)');
      });
    });

    describe('#compare()', () => {
      it('compare CFIs', () => {
        const epubcfi = new EpubCFI();
        // Spines
        expect(
          epubcfi.compare('epubcfi(/6/4[cover]!/4)', 'epubcfi(/6/2[cover]!/4)')
        ).toBe(1);
        expect(
          epubcfi.compare('epubcfi(/6/4[cover]!/4)', 'epubcfi(/6/6[cover]!/4)')
        ).toBe(-1);
        // First is deeper
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/8/2)',
            'epubcfi(/6/2[cover]!/6)'
          )
        ).toBe(1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/2)',
            'epubcfi(/6/2[cover]!/6)'
          )
        ).toBe(-1);
        // Second is deeper
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/8/2)',
            'epubcfi(/6/2[cover]!/6/4/2/2)'
          )
        ).toBe(1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/4)',
            'epubcfi(/6/2[cover]!/6/4/2/2)'
          )
        ).toBe(-1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/6)',
            'epubcfi(/6/2[cover]!/4/6/8/1:0)'
          )
        ).toBe(-1);
        // Same Depth
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/6/8)',
            'epubcfi(/6/2[cover]!/6/2)'
          )
        ).toBe(1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/20)',
            'epubcfi(/6/2[cover]!/6/10)'
          )
        ).toBe(-1);
        // Text nodes
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/5)',
            'epubcfi(/6/2[cover]!/4/3)'
          )
        ).toBe(1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/7)',
            'epubcfi(/6/2[cover]!/4/13)'
          )
        ).toBe(-1);
        // Char offset
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/5:1)',
            'epubcfi(/6/2[cover]!/4/5:0)'
          )
        ).toBe(1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/5:2)',
            'epubcfi(/6/2[cover]!/4/5:30)'
          )
        ).toBe(-1);
        // Normal example
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/8/5:1)',
            'epubcfi(/6/2[cover]!/4/6/15:2)'
          )
        ).toBe(1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/2[cover]!/4/8/1:0)',
            'epubcfi(/6/2[cover]!/4/8/1:0)'
          )
        ).toBe(0);
        // Different Lengths
        expect(
          epubcfi.compare(
            'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/10/1:317)',
            'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/10/2[page18]/1:0)'
          )
        ).toBe(-1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/12/1:0)',
            'epubcfi(/6/16[id42]!/4[5N3C0-8c483216e03a4ff49927fc1a97dc7b2c]/12/2/1:9)'
          )
        ).toBe(-1);
        expect(
          epubcfi.compare(
            'epubcfi(/6/16!/4/12/1:0)',
            'epubcfi(/6/16!/4/12/2/1:9)'
          )
        ).toBe(-1);
      });
    });
  });

  describe('EpubCFI', () => {
    describe('constructor type handling', () => {
      it('should accept a string CFI', () => {
        const cfi = new EpubCFI(
          'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
        );
        expect(cfi).toBeInstanceOf(EpubCFI);
        expect(cfi.str).toBe(
          'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
        );
      });

      it('should accept a real DOM Range', () => {
        document.documentElement.innerHTML =
          '<div><p>hello <span>world</span></p></div>';
        const p = document.querySelector('p');
        const span = document.querySelector('span');
        const range = document.createRange();
        range.setStart(p!.firstChild as Node, 0); // "hello "
        range.setEnd(span!.firstChild as Node, 3); // "wor"
        console.log('Legacy test: Real Range passed to EpubCFI:', range);
        const cfi = new EpubCFI(range);
        expect(cfi).toBeInstanceOf(EpubCFI);
        expect(cfi.range).toBe(true);

        // remove document content to avoid side effects
        document.documentElement.innerHTML = '';
      });

      it('should accept a Node (mocked)', () => {
        // Minimal mock for Node
        const node = { nodeType: 1, parentNode: null };
        const cfi = new EpubCFI(node as Node);
        expect(cfi).toBeInstanceOf(EpubCFI);
        expect(cfi.range).toBe(false);
      });

      it('should accept an EpubCFI instance', () => {
        const original = new EpubCFI(
          'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
        );
        const cfi = new EpubCFI(original as any);
        expect(cfi).toBeInstanceOf(EpubCFI);
        expect(cfi.str).toBe(
          'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
        );
      });

      it('should handle null/undefined', () => {
        expect(new EpubCFI(undefined)).toBeInstanceOf(EpubCFI);
        expect(new EpubCFI(null as any)).toBeInstanceOf(EpubCFI);
      });

      it('should throw on invalid type', () => {
        expect(() => new EpubCFI(123 as any)).toThrow(TypeError);
        expect(() => new EpubCFI({} as any)).toThrow(TypeError);
      });
    });

    it('should parse a simple CFI string', () => {
      const cfi = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
      );
      expect(cfi.spinePos).toBe(1);
      expect(cfi.path.steps.length).toBeGreaterThan(0);
      expect(cfi.path.terminal.offset).toBe(3);
    });

    it('should parse a range CFI string', () => {
      const cfi = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)'
      );
      expect(cfi.range).toBe(true);
      expect(cfi.start?.terminal.offset).toBe(1);
      expect(cfi.end?.terminal.offset).toBe(4);
    });

    it('should convert to string', () => {
      const cfi = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
      );
      expect(cfi.toString()).toBe(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
      );
    });

    it('should compare two CFIs', () => {
      const cfi1 = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)'
      );
      const cfi2 = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:5)'
      );
      expect(cfi1.compare(cfi1, cfi2)).toBe(-1);
      expect(cfi1.compare(cfi2, cfi1)).toBe(1);
      expect(cfi1.compare(cfi1, cfi1)).toBe(0);
    });

    it('should collapse a range CFI to start', () => {
      const cfi = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)'
      );
      cfi.collapse(true);
      expect(cfi.range).toBe(false);
      expect(cfi.path.terminal.offset).toBe(1);
    });

    it('should collapse a range CFI to end', () => {
      const cfi = new EpubCFI(
        'epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)'
      );
      cfi.collapse(false);
      expect(cfi.range).toBe(false);
      expect(cfi.path.terminal.offset).toBe(4);
    });

    it('should fail to resolve a problematic CFI string to a DOM Range', () => {
      // Setup minimal DOM structure
      document.body.innerHTML = `
        <section id="chapter">
          <p id="para">Call me Ishmael.</p>
        </section>
      `;
      // Problematic CFI string as seen in logs
      const problematicCfi = 'epubcfi(/6/14!/0/1,/:0,/:0)';
      const cfi = new EpubCFI(problematicCfi);
      const range = cfi.toRange(document);

      expect(range).toBeNull();
      document.body.innerHTML = '';
    });
  });
});
