import { fail } from 'assert';
import { describe, expect, it } from 'vitest';

describe('panic.clar', () => {
  it('should panic on public function', () => {
    try {
      simnet.callPublicFn('panic', 'panic', [], simnet.deployer);
      fail('should have thrown an exception');
    } catch (e) {
      expect(e).toMatch(/Call contract function error: panic::panic\(\)/);
    }
  });

  it('should panic on read-only function', () => {
    try {
      simnet.callReadOnlyFn('panic', 'panic-read-only', [], simnet.deployer);
      fail('should have thrown an exception');
    } catch (e) {
      expect(e).toMatch(/Call contract function error: panic::panic-read-only\(\)/);
    }
  });
});
