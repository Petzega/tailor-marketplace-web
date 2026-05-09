import { describe, it, expect } from 'vitest';
import { generateValidationCode } from '@/lib/utils';

describe('generateValidationCode', () => {
  it('should return a 6 character string', () => {
    const code = generateValidationCode();
    expect(code).toHaveLength(6);
  });

  it('should only contain valid characters (no I, O, 0, 1)', () => {
    const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const code = generateValidationCode();
    for (const char of code) {
      expect(validChars).toContain(char);
    }
  });

  it('should generate different codes on consecutive calls', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateValidationCode());
    }
    expect(codes.size).toBeGreaterThan(95);
  });
});
