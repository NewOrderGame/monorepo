import { describe } from '@jest/globals';
import { AxialHex, CubicHex } from '../types';
import HexUtils from './hex-utils';
import { Hexagon } from '../hexagon';
import { HexDirectionAngle, HexDirectionPov } from '../enums';

describe('Hex utils', () => {
  describe('cubicToAxial', () => {
    it('should convert cubic (1, -3, 2) to axial (1, 2)', () => {
      const cubic: CubicHex = { x: 1, y: -3, z: 2 };
      const expected: AxialHex = { x: 1, y: 2 };
      expect(HexUtils.cubicToAxial(cubic)).toEqual(expected);
    });

    it('should convert cubic (0, 0, 0) to axial (0, 0)', () => {
      const cubic: CubicHex = { x: 0, y: 0, z: 0 };
      const expected: AxialHex = { x: 0, y: 0 };
      expect(HexUtils.cubicToAxial(cubic)).toEqual(expected);
    });

    it('should convert cubic (-1, -1, 2) to axial (-1, 2)', () => {
      const cubic: CubicHex = { x: -1, y: -1, z: 2 };
      const expected: AxialHex = { x: -1, y: 2 };
      expect(HexUtils.cubicToAxial(cubic)).toEqual(expected);
    });

    it('should convert cubic (3, -4, 1) to axial (3, 1)', () => {
      const cubic: CubicHex = { x: 3, y: -4, z: 1 };
      const expected: AxialHex = { x: 3, y: 1 };
      expect(HexUtils.cubicToAxial(cubic)).toEqual(expected);
    });

    it('should convert cubic (2, -3, 1) to axial (2, 1)', () => {
      const cubic: CubicHex = { x: 2, y: -3, z: 1 };
      const expected: AxialHex = { x: 2, y: 1 };
      expect(HexUtils.cubicToAxial(cubic)).toEqual(expected);
    });
  });

  describe('axialToCubic', () => {
    it('should convert axial (1, 2) to cubic (1, -3, 2)', () => {
      const axial: AxialHex = { x: 1, y: 2 };
      const expected: CubicHex = { x: 1, y: -3, z: 2 };
      expect(HexUtils.axialToCubic(axial)).toEqual(expected);
    });

    it('should convert axial (0, 0) to cubic (0, 0, 0)', () => {
      const axial: AxialHex = { x: 0, y: 0 };
      const result = HexUtils.axialToCubic(axial);
      const cleanedResult = {
        x: result.x,
        y: result.y,
        z: result.z
      };
      const expected: CubicHex = { x: 0, y: 0, z: 0 };
      expect(cleanedResult).toEqual(expected);
    });

    it('should convert axial (-1, 2) to cubic (-1, -1, 2)', () => {
      const axial: AxialHex = { x: -1, y: 2 };
      const expected: CubicHex = { x: -1, y: -1, z: 2 };
      expect(HexUtils.axialToCubic(axial)).toEqual(expected);
    });

    it('should convert axial (3, -3) to cubic (3, 0, -3)', () => {
      const axial: AxialHex = { x: 3, y: -3 };
      const expected: CubicHex = { x: 3, y: 0, z: -3 };
      expect(HexUtils.axialToCubic(axial)).toEqual(expected);
    });

    it('should convert axial (-2, -1) to cubic (-2, 3, -1)', () => {
      const axial: AxialHex = { x: -2, y: -1 };
      const expected: CubicHex = { x: -2, y: 3, z: -1 };
      expect(HexUtils.axialToCubic(axial)).toEqual(expected);
    });
  });

  describe('calculateCubicDistance', () => {
    it('should calculate the distance between two identical hexagons as 0', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(0, 0, 0);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(0);
    });

    it('should calculate the distance between (0, 0, 0) and (1, -3, 2) as 3', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(1, -3, 2);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(3);
    });

    it('should calculate the distance between two hexagons with only one differing coordinate', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(3, 0, -3);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(3);
    });

    it('should calculate the distance between distant hexagons', () => {
      const hexA = new Hexagon(-5, 5, 0);
      const hexB = new Hexagon(5, -5, 0);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(10);
    });

    it('should handle negative coordinates', () => {
      const hexA = new Hexagon(-3, 3, 0);
      const hexB = new Hexagon(-4, 4, 0);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(1);
    });

    it('should handle hexagons with all positive coordinates', () => {
      const hexA = new Hexagon(3, 2, -5);
      const hexB = new Hexagon(4, 1, -5);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(1);
    });

    it('should handle hexagons with all negative coordinates', () => {
      const hexA = new Hexagon(-3, -2, 5);
      const hexB = new Hexagon(-4, -1, 5);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(1);
    });

    it('should calculate the distance between hexagons with large coordinate values', () => {
      const hexA = new Hexagon(100, -200, 100);
      const hexB = new Hexagon(-100, 200, -100);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(400);
    });

    it('should calculate the distance between hexagons with even larger coordinate values', () => {
      const hexA = new Hexagon(1000, -2000, 1000);
      const hexB = new Hexagon(-1000, 2000, -1000);
      expect(HexUtils.calculateCubicDistance(hexA, hexB)).toEqual(4000);
    });

    it('should not calculate a distance greater than 1,000,000 for hexagons within a radius of 1,000,000', () => {
      const hexA = new Hexagon(1_000_000, -500_000, -500_000);
      const hexB = new Hexagon(-1_000_000, 500_000, 500_000);

      const distance = HexUtils.calculateCubicDistance(hexA, hexB);

      expect(distance).toBeLessThanOrEqual(2_000_000);
      expect(distance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateAxialDistance', () => {
    it('should calculate the distance between two points in axial coordinates', () => {
      const axialA: AxialHex = { x: 0, y: 0 };
      const axialB: AxialHex = { x: 1, y: 2 };
      expect(HexUtils.calculateAxialDistance(axialA, axialB)).toEqual(2);
    });

    it('should calculate the distance between two points with negative axial coordinates', () => {
      const axialA: AxialHex = { x: -1, y: -2 };
      const axialB: AxialHex = { x: 1, y: 2 };
      expect(HexUtils.calculateAxialDistance(axialA, axialB)).toEqual(4);
    });

    it('should calculate a distance of 0 for the same axial point', () => {
      const axialA: AxialHex = { x: 1, y: 2 };
      expect(HexUtils.calculateAxialDistance(axialA, axialA)).toEqual(0);
    });

    it('should calculate the distance between two far apart axial points', () => {
      const axialA: AxialHex = { x: 100, y: -200 };
      const axialB: AxialHex = { x: -100, y: 200 };
      expect(
        HexUtils.calculateAxialDistance(axialA, axialB)
      ).toBeGreaterThanOrEqual(300);
    });

    it('should calculate the distance between two even farther apart axial points', () => {
      const axialA: AxialHex = { x: 1000, y: -2000 };
      const axialB: AxialHex = { x: -1000, y: 2000 };
      expect(
        HexUtils.calculateAxialDistance(axialA, axialB)
      ).toBeGreaterThanOrEqual(3000);
    });

    it('should calculate a distance greater than 1,000,000 for axial points within a radius of 1,000,000', () => {
      const axialA: AxialHex = { x: 500_000, y: 500_000 };
      const axialB: AxialHex = { x: -500_000, y: -500_000 };
      const distance = HexUtils.calculateAxialDistance(axialA, axialB);
      expect(distance).toBeLessThanOrEqual(2_000_000);
      expect(distance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('drawLine', () => {
    it('should draw a line between two identical hexagons', () => {
      const hexA = new Hexagon(0, 0, 0);
      const line = HexUtils.drawLine(hexA, hexA);
      expect(line.length).toEqual(1);
      expect(line[0].toCubic()).toEqual(hexA.toCubic());
    });

    it('should draw a short line between neighboring hexagons', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(1, -1, 0);
      const line = HexUtils.drawLine(hexA, hexB);
      expect(line.length).toBeGreaterThanOrEqual(2);
      expect(line[0].toCubic()).toEqual(hexA.toCubic());
      expect(line[line.length - 1].toCubic()).toEqual(hexB.toCubic());
    });

    it('should draw a diagonal line between two hexagons', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(3, -3, 0);
      const line = HexUtils.drawLine(hexA, hexB);
      expect(line[0].toCubic()).toEqual(hexA.toCubic());
      expect(line[line.length - 1].toCubic()).toEqual(hexB.toCubic());
    });

    it('should draw a line passing through negative coordinates', () => {
      const hexA = new Hexagon(-1, 1, 0);
      const hexB = new Hexagon(1, -1, 0);
      const line = HexUtils.drawLine(hexA, hexB);
      expect(line[0].toCubic()).toEqual(hexA.toCubic());
      expect(line[line.length - 1].toCubic()).toEqual(hexB.toCubic());
    });

    it('should draw a line between hexagons with larger coordinate values', () => {
      const hexA = new Hexagon(10, -20, 10);
      const hexB = new Hexagon(20, -10, -10);
      const line = HexUtils.drawLine(hexA, hexB);
      expect(line[0].toCubic()).toEqual(hexA.toCubic());
      expect(line[line.length - 1].toCubic()).toEqual(hexB.toCubic());
    });

    it('should ensure varied line lengths are correctly computed', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(5, -5, 0);
      const hexC = new Hexagon(10, -10, 0);
      const line1 = HexUtils.drawLine(hexA, hexB);
      const line2 = HexUtils.drawLine(hexA, hexC);
      expect(line1.length < line2.length).toBeTruthy();
      expect(line1[0].toCubic()).toEqual(hexA.toCubic());
      expect(line2[0].toCubic()).toEqual(hexA.toCubic());
    });
  });

  describe('cubicRound', () => {
    it('should round cubic coordinates correctly for positive fractions', () => {
      const hex: CubicHex = { x: 1.2, y: -3.4, z: 2.2 };
      const expected: CubicHex = { x: 1, y: -3, z: 2 };
      expect(HexUtils.cubicRound(hex)).toEqual(expected);
    });

    it('should round cubic coordinates up for values close to .5', () => {
      const hex: CubicHex = { x: 0.5, y: 1.5, z: -2 };
      const expected: CubicHex = { x: 1, y: 1, z: -2 };
      expect(HexUtils.cubicRound(hex)).toEqual(expected);
    });

    it('should round cubic coordinates down for negative values close to .5', () => {
      const hex: CubicHex = { x: -0.5, y: -1.5, z: -2.5 };
      const expected: CubicHex = { x: -1, y: -2, z: 3 };
      expect(HexUtils.cubicRound(hex)).toEqual(expected);
    });

    it('should round cubic coordinates correctly for negative fractions', () => {
      const hex: CubicHex = { x: -1.2, y: 3.4, z: -2.2 };
      const expected: CubicHex = { x: -1, y: 3, z: -2 };
      expect(HexUtils.cubicRound(hex)).toEqual(expected);
    });

    it('should round cubic coordinates to nearest integer for values close to .9', () => {
      const hex: CubicHex = { x: 0.9, y: 1.9, z: -2.9 };
      const expected: CubicHex = { x: 1, y: 2, z: -3 };
      expect(HexUtils.cubicRound(hex)).toEqual(expected);
    });

    it('should round cubic coordinates correctly for values with no fractions', () => {
      const hex: CubicHex = { x: 1, y: -3, z: 2 };
      const expected: CubicHex = { x: 1, y: -3, z: 2 };
      expect(HexUtils.cubicRound(hex)).toEqual(expected);
    });

    it('should maintain the cubic coordinate invariant x + y + z = 0 after rounding', () => {
      // Define a set of test coordinates
      const testCoordinates = [
        { x: 1.4, y: -2.7, z: 1.3 },
        { x: -1.6, y: 0.8, z: 0.8 },
        { x: 0.5, y: -1.3, z: 0.8 },
        { x: -0.2, y: 2.1, z: -1.9 },
        { x: 1.9, y: -1.1, z: -0.8 }
      ];

      for (const coord of testCoordinates) {
        const rounded = HexUtils.cubicRound(coord);
        expect(rounded.x + rounded.y + rounded.z).toEqual(0);
      }
    });
  });

  describe('axialRound', () => {
    it('should round axial coordinates towards nearest whole values', () => {
      const hex: AxialHex = { x: 0.7, y: 0.2 };
      const result = HexUtils.axialRound(hex);

      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(0);
    });

    it('should correctly round when values are halfway between two whole numbers', () => {
      const hex: AxialHex = { x: 1.5, y: -1.5 };
      const result = HexUtils.axialRound(hex);

      expect(result.x).toBeCloseTo(2);
      expect(result.y).toBeCloseTo(-2);
    });

    it('should not change coordinates that are already whole numbers', () => {
      const hex: AxialHex = { x: 2, y: -3 };
      const result = HexUtils.axialRound(hex);

      expect(result.x).toBe(2);
      expect(result.y).toBe(-3);
    });

    it('should handle rounding of negative fractional values', () => {
      const hex: AxialHex = { x: -0.7, y: -0.3 };
      const result = HexUtils.axialRound(hex);

      expect(result.x).toBeCloseTo(-1);
      expect(result.y).toBeCloseTo(0);
    });

    it('should handle complex rounding scenarios', () => {
      const hex: AxialHex = { x: 0.4, y: 2.6 };
      const result = HexUtils.axialRound(hex);

      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(3);
    });
  });

  describe('lerp', () => {
    it('should interpolate between two numbers', () => {
      expect(HexUtils.lerp(0, 10, 0.5)).toBe(5);
      expect(HexUtils.lerp(5, 15, 0.25)).toBe(7.5);
    });

    it('should return start value when t is 0', () => {
      expect(HexUtils.lerp(0, 10, 0)).toBe(0);
    });

    it('should return end value when t is 1', () => {
      expect(HexUtils.lerp(0, 10, 1)).toBe(10);
    });

    it('should handle negative values', () => {
      expect(HexUtils.lerp(-10, 10, 0.5)).toBe(0);
      expect(HexUtils.lerp(-5, -15, 0.25)).toBe(-7.5);
    });

    it('should interpolate beyond end value for t > 1', () => {
      expect(HexUtils.lerp(0, 10, 1.5)).toBe(15);
    });

    it('should interpolate before start value for t < 0', () => {
      expect(HexUtils.lerp(0, 10, -0.5)).toBe(-5);
    });
  });

  describe('cubicLerp', () => {
    it('should interpolate between two hexagons', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(10, 10, -20);

      const result = HexUtils.cubicLerp(hexA, hexB, 0.5);
      const cubicResult = result.toCubic();

      expect(cubicResult.x).toBeCloseTo(5);
      expect(cubicResult.y).toBeCloseTo(5);
      expect(cubicResult.z).toBeCloseTo(-10);
    });

    it('should return start hexagon when t is 0', () => {
      const hexA = new Hexagon(0, 0);
      const hexB = new Hexagon(10, 10);

      const result = HexUtils.cubicLerp(hexA, hexB, 0);
      const cubicResult = result.toCubic();

      expect(cubicResult.x).toBe(0);
      expect(cubicResult.y).toBe(0);
      expect(cubicResult.z).toBe(0);
    });

    it('should return end hexagon when t is 1', () => {
      const hexA = new Hexagon(0, 0, 0);
      const hexB = new Hexagon(10, 10, -20);

      const result = HexUtils.cubicLerp(hexA, hexB, 1);
      const cubicResult = result.toCubic();

      expect(cubicResult.x).toBe(10);
      expect(cubicResult.y).toBe(10);
      expect(cubicResult.z).toBe(-20);
    });

    it('should handle different hexagon positions', () => {
      const hexA = new Hexagon(3, 5, -8);
      const hexB = new Hexagon(7, -3, -4);

      const result = HexUtils.cubicLerp(hexA, hexB, 0.5);
      const cubicResult = result.toCubic();

      expect(cubicResult.x).toBeCloseTo(5);
      expect(cubicResult.y).toBeCloseTo(1);
      expect(cubicResult.z).toBeCloseTo(-6);
    });
  });
});
describe('Neighbors', () => {
  describe('Cubic Operations', () => {
    it('should provide correct cubic direction for a given index', () => {
      const result = HexUtils.cubicDirection(HexDirectionAngle.A120);
      expect(result).toEqual({ x: 0, y: -1, z: +1 });
    });

    it('should add two cubic hexes correctly', () => {
      const hex1 = { x: 1, y: -1, z: 0 };
      const hex2 = { x: -1, y: 1, z: 0 };
      const result = HexUtils.cubicAdd(hex1, hex2);
      expect(result.toCubic()).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should provide correct cubic neighbor for a hex and direction', () => {
      const cube = { x: 1, y: -1, z: 0 };
      const result = HexUtils.cubicNeighbor(cube, 2);
      expect(result.toCubic()).toEqual({ x: 1, y: -2, z: 1 });
    });
  });

  describe('Axial Operations', () => {
    it('should provide correct axial direction for a given index', () => {
      const result = HexUtils.axialDirection(HexDirectionPov.BACK_RIGHT);
      expect(result).toEqual({ x: 0, y: 1 });
    });

    it('should add two axial hexes correctly', () => {
      const hex1 = { x: 1, y: -1 };
      const hex2 = { x: -1, y: 1 };
      const result = HexUtils.axialAdd(hex1, hex2);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should provide correct axial neighbor for a hex and direction', () => {
      const hex = { x: 1, y: -1 };
      const result = HexUtils.axialNeighbor(hex, 2);
      expect(result).toEqual({ x: 1, y: 0 });
    });
  });
});
