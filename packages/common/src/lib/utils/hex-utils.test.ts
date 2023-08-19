import { expect, describe, test } from '@jest/globals';

import HexUtils from './hex-utils';
import { Hexagon } from '../hexagon';

describe('Hex utils', () => {
  describe('calculateDistance', () => {
    test('Should calculate distance between hexagons', () => {
      const hexA = new Hexagon(0, 0);
      const hexB = new Hexagon(0, 10);

      const distance = HexUtils.calculateDistance(hexA, hexB);

      expect(distance).toBe(10);
    });
    test('Should calculate distance between hexagons', () => {
      const hexA = new Hexagon(-1, -1);
      const hexB = new Hexagon(1, 1);

      const distance = HexUtils.calculateDistance(hexA, hexB);

      expect(distance).toBe(2);
    });
    test('Should calculate distance between hexagons', () => {
      const hexA = new Hexagon(0, 0);
      const hexB = new Hexagon(-1, 1);

      const distance = HexUtils.calculateDistance(hexA, hexB);

      expect(distance).toBe(2);
    });
  });

  describe('drawLine', () => {
    test('Should return 2 hex line between neighbour hexagons', () => {
      const hexA = new Hexagon(0, 0);
      const hexB = new Hexagon(1, 1);

      const line = HexUtils.drawLine(hexA, hexB);

      expect(line).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 1, y: -1, z: 0 })
        ])
      );
    });

    test('Should return 2 hex line between neighbour hexagons with negative X', () => {
      const hexA = new Hexagon(0, 0);
      const hexB = new Hexagon(-1, 1);

      const line = HexUtils.drawLine(hexA, hexB);

      expect(line).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: -1, y: 0, z: 1 }),
          expect.objectContaining({ x: -1, y: -1, z: 2 })
        ])
      );
    });

    test('Should return line between hexagons', () => {
      const hexA = new Hexagon(0, 0);
      const hexB = new Hexagon(1, 18);

      const line = HexUtils.drawLine(hexA, hexB);

      expect(line).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 }),
          expect.objectContaining({ x: 0, y: 0, z: 0 })
        ])
      );
    });
  });
});
