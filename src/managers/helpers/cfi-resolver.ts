import Section from '../../section';

export class CfiResolver {
  async resolveForElement(
    doc: Document,
    section: Section,
    el: Element | null
  ): Promise<{ cfi?: string }> {
    if (!el || !section.cfiFrom) return { cfi: undefined };

    const targets = [
      this.descendantTextNodeTarget(doc, el),
      this.elementTarget(el),
      this.elementRangeTarget(doc, el),
      this.previousTextNodeTarget(doc, el),
    ];

    for (const target of targets) {
      if (!target) continue;

      const cfi = this.safeCfiPoint(section, target);

      if (cfi) return { cfi };
    }

    return { cfi: this.createApproximateCfi(doc, el, section) ?? undefined };
  }

  private safeCfiPoint(section: Section, target: Range | Node): string | null {
    try {
      let cfi = section.cfiFrom?.(target) || null;
      if (!cfi) return null;

      // Normalize: only keep the "point" part of a range
      const commaIndex = cfi.indexOf(',');
      if (commaIndex !== -1) {
        cfi = cfi.slice(0, commaIndex) + ')';
      }

      return cfi;
    } catch {
      return null;
    }
  }
  // ---- Strategy extractors ----

  private descendantTextNodeTarget(doc: Document, el: Element): Range | null {
    const txt = this.findFirstTextNode(doc, el);
    if (!txt) return null;
    const range = doc.createRange();
    range.setStart(txt, 0);
    range.setEnd(txt, 0);
    return range;
  }

  private elementTarget(el: Element): Node {
    return el;
  }

  private elementRangeTarget(doc: Document, el: Element): Range {
    const range = doc.createRange();
    range.selectNode(el);
    return range;
  }

  private previousTextNodeTarget(doc: Document, el: Element): Range | null {
    const txt = this.findPreviousTextNode(doc, el);
    if (!txt) return null;
    const range = doc.createRange();
    range.setStart(txt, 0);
    range.setEnd(txt, 0);
    return range;
  }

  // ---- Approximation ----

  private createApproximateCfi(
    doc: Document,
    el: Element,
    section: Section
  ): string | null {
    if (!section.cfiBase) return null;

    const path: number[] = [];
    let cur: Node | null = el;

    while (cur && cur !== doc.documentElement && cur !== doc.body) {
      const parent = cur.parentNode as Element;
      if (!parent) break;
      const index = Array.prototype.indexOf.call(parent.childNodes, cur);
      if (index !== -1) path.unshift(index);
      cur = parent;
    }

    return `${section.cfiBase}!/approx(${path.join('.')})`;
  }

  // ---- Helpers (TreeWalker only) ----

  private findFirstTextNode(doc: Document, el: Element): Text | null {
    const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.textContent?.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
    return walker.nextNode() as Text | null;
  }

  private findPreviousTextNode(doc: Document, el: Element): Text | null {
    // Create a walker starting at the document root
    const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.textContent?.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });

    let prev: Text | null = null;
    let node: Node | null = walker.nextNode();

    while (node) {
      if (node === el) break;
      prev = node as Text;
      node = walker.nextNode();
    }

    return prev;
  }
}
