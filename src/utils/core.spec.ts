import { getValidOrDefault } from './core';

describe('getValidOrDefault', () => {
  const allowed = ['foo', 'bar', 'baz'] as const;
  const defaultValue = 'foo';

  it('returns the value if it is allowed', () => {
    expect(getValidOrDefault('bar', allowed, defaultValue)).toBe('bar');
    expect(getValidOrDefault('baz', allowed, defaultValue)).toBe('baz');
  });

  it('returns the default if value is not allowed', () => {
    expect(getValidOrDefault('qux', allowed, defaultValue)).toBe('foo');
    expect(getValidOrDefault('', allowed, defaultValue)).toBe('foo');
  });

  it('returns the default if value is null or undefined', () => {
    expect(getValidOrDefault(null, allowed, defaultValue)).toBe('foo');
    expect(getValidOrDefault(undefined, allowed, defaultValue)).toBe('foo');
  });
});
