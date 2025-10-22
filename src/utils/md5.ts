import { md5 } from 'hash-wasm';

/**
 * Generate MD5 hash from input string
 * @param input - String to hash
 * @returns Promise resolving to uppercase MD5 hex string
 */
export async function md5Hex(input: string): Promise<string> {
  return (await md5(input)).toUpperCase();
}
