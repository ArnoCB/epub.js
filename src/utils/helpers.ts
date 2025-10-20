/**
 * Gets the index of a node in its parent
 */
function indexOfNode(node: Node, typeId: number): number {
  const parent = node.parentNode;

  if (!parent) {
    return -1;
  }

  const children = parent.childNodes;
  let sib: Node | undefined;
  let index = -1;
  for (let i = 0; i < children.length; i++) {
    sib = children[i];
    if (sib && sib.nodeType === typeId) {
      index++;
    }
    if (sib == node) break;
  }

  return index;
}

export function indexOfElementNode(elementNode: Node) {
  return indexOfNode(elementNode, 1);
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last invocation.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every specified wait time.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
