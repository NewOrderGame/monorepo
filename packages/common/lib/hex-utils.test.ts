import { CubicHex } from './cubic-hex';
import { calculateDistance, drawLine } from './hex-utils';

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
      const hexB = new CubicHex(1, 1);

      const distance = calculateDistance(hexA, hexB);

      expect(distance).toBe(2);
    });
    test('Should calculate distance between hexagons', () => {
      const hexA = new CubicHex(0, 0);
      const hexB = new CubicHex(-1, 1);

      const distance = calculateDistance(hexA, hexB);

      expect(distance).toBe(2);
    });
  });

  describe('drawLine', () => {
    test('Should return 2 hex line between neighbour hexagons', () => {
      const hexA = new CubicHex(0, 0);
      const hexB = new CubicHex(1, 1);

      const line = drawLine(hexA, hexB);

      expect(line).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 1, y: -1, z: 0 })
        ])
      );
    });

    test('Should return 2 hex line between neighbour hexagons with negative X', () => {
      const hexA = new CubicHex(0, 0);
      const hexB = new CubicHex(-1, 1);

      const line = drawLine(hexA, hexB);

      expect(line).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: -1, y: 0, z: 1 }),
          expect.objectContaining({ x: -1, y: -1, z: 2 })
        ])
      );
    });

    test('Should return line between hexagons', () => {
      const hexA = new CubicHex(0, 0);
      const hexB = new CubicHex(1, 18);

      const line = drawLine(hexA, hexB);

      expect(line).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 100, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
            expect.objectContaining({ x: 0, y: 0, z: 0 }),
          ])
      );
    });
  });
});
