import { CubicHex } from './cubic-hex';
import { calculateDistance, calculateLine } from './hex-utils';

describe('Hex utils', () => {
  describe('calculateDistance', () => {
    test('Should calculate distance between hexagons', () => {
      const hexA = new CubicHex(0, 0);
      const hexB = new CubicHex(0, 10);

      const distance = calculateDistance(hexA, hexB);

      expect(distance).toBe(10);
    });
    test('Should calculate distance between hexagons', () => {
      const hexA = new CubicHex(-1, -1);
      const hexB = new CubicHex(10, 10);

      const distance = calculateDistance(hexA, hexB);

      expect(distance).toBe(11);
    });
  });

  describe('calculateLine', () => {
    test('Should calculate distance between hexagons', () => {
      const hexA = new CubicHex(5, 0);
      const hexB = new CubicHex(0, 10);

      const line = calculateLine(hexA, hexB);

      expect(line).toBe(10);
    });
  });
});
