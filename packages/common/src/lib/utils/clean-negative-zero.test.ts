import cleanNegativeZero from './clean-negative-zero';

describe('cleanNegativeZero', () => {
  it('should convert negative zero to positive zero', () => {
    const input = -0;
    const result = cleanNegativeZero(input);
    expect(Object.is(result, 0)).toBe(true);
  });

  it('should not change positive zero', () => {
    const input = 0;
    const result = cleanNegativeZero(input);
    expect(Object.is(result, 0)).toBe(true);
  });

  it('should not change positive non-zero numbers', () => {
    const input = 1;
    const result = cleanNegativeZero(input);
    expect(result).toBe(1);
  });

  it('should not change negative non-zero numbers', () => {
    const input = -1;
    const result = cleanNegativeZero(input);
    expect(result).toBe(-1);
  });

  it('should not change NaN', () => {
    const input = NaN;
    const result = cleanNegativeZero(input);
    expect(Number.isNaN(result)).toBe(true);
  });

  it('should not change Infinity', () => {
    const input = Infinity;
    const result = cleanNegativeZero(input);
    expect(result).toBe(Infinity);
  });

  it('should not change negative Infinity', () => {
    const input = -Infinity;
    const result = cleanNegativeZero(input);
    expect(result).toBe(-Infinity);
  });

  it('should handle large numbers', () => {
    const input = 1234567890;
    const result = cleanNegativeZero(input);
    expect(result).toBe(1234567890);
  });
});
