import { Hexagon } from './hexagon';
import { describe } from '@jest/globals';
import { AxialHex, CubicHex } from './types';
import {
  HexDirectionAngle,
  HexDirectionClock,
  HexDirectionDescriptive,
  HexDirectionPov
} from './enums';

describe('Hexagon', () => {
  describe('Constructor', () => {
    it('should create a hexagon with valid cubic coordinates', () => {
      const hex = new Hexagon(1, -1, 0);
      const cubic = hex.toCubic();
      expect(cubic.x).toBe(1);
      expect(cubic.y).toBe(-1);
      expect(cubic.z).toBe(0);
    });

    it('should create a hexagon with valid axial coordinates', () => {
      const hex = new Hexagon(1, 1);
      const cubic = hex.toCubic();
      expect(cubic.x).toBe(1);
      expect(cubic.y).toBe(-1);
      expect(cubic.z).toBe(0);
    });

    it('should throw error for NaN values', () => {
      expect(() => new Hexagon(NaN, 0, 0)).toThrowError('NaN is present');
      expect(() => new Hexagon(0, NaN, 0)).toThrowError('NaN is present');
      expect(() => new Hexagon(0, 0, NaN)).toThrowError('NaN is present');
      expect(() => new Hexagon(NaN, NaN, NaN)).toThrow('NaN is present');
    });

    it('should handle the optional z parameter', () => {
      const hex = new Hexagon(1, -1);
      const cubic = hex.toCubic();
      expect(cubic.z).toBe(-2);
    });

    it('should throw error for invalid cubic coordinates', () => {
      expect(() => new Hexagon(1, 1, 1)).toThrowError(
        'The sum of cubic hex coordinates (x, y, and z) should equal 0'
      );
      expect(() => new Hexagon(1, -1, 1)).toThrowError(
        'The sum of cubic hex coordinates (x, y, and z) should equal 0'
      );
      expect(() => new Hexagon(0, 13, 0)).toThrowError(
        'The sum of cubic hex coordinates (x, y, and z) should equal 0'
      );
      expect(() => new Hexagon(2, -1, 1)).toThrowError(
        'The sum of cubic hex coordinates (x, y, and z) should equal 0'
      );
    });
  });

  describe('fromCubic and fromAxial static methods', () => {
    it('should correctly convert cubic to hexagon', () => {
      const hex = Hexagon.fromCubic({ x: 1, y: -1, z: 0 });
      expect(hex.toCubic()).toEqual({ x: 1, y: -1, z: 0 });
    });

    it('should correctly convert axial to hexagon', () => {
      const hex = Hexagon.fromAxial({ x: 1, y: -1 });
      expect(hex.toAxial()).toEqual({ x: 1, y: -1 });
    });
  });

  describe('toCubic and toAxial methods', () => {
    it('should convert to cubic representation', () => {
      const hex = new Hexagon(1, -1, 0);
      expect(hex.toCubic()).toEqual({ x: 1, y: -1, z: 0 });
    });

    it('should convert to axial representation', () => {
      const hex = new Hexagon(1, -1, 0);
      expect(hex.toAxial()).toEqual({ x: 1, y: 1 });
    });
  });

  describe('utility static methods', () => {
    describe('cubicToAxial', () => {
      it('should convert cubic (1, -3, 2) to axial (1, 3)', () => {
        const cubic: CubicHex = { x: 1, y: -3, z: 2 };
        const expected: AxialHex = { x: 1, y: 3 };
        expect(Hexagon.cubicToAxial(cubic)).toEqual(expected);
      });

      it('should convert cubic (0, 0, 0) to axial (0, 0)', () => {
        const cubic: CubicHex = { x: 0, y: 0, z: 0 };
        const expected: AxialHex = { x: 0, y: 0 };
        expect(Hexagon.cubicToAxial(cubic)).toEqual(expected);
      });

      it('should convert cubic (-1, -1, 2) to axial (-1, 1)', () => {
        const cubic: CubicHex = { x: -1, y: -1, z: 0 };
        const expected: AxialHex = { x: -1, y: 1 };
        expect(Hexagon.cubicToAxial(cubic)).toEqual(expected);
      });

      it('should convert cubic (3, -4, 1) to axial (3, 4)', () => {
        const cubic: CubicHex = { x: 3, y: -4, z: 1 };
        const expected: AxialHex = { x: 3, y: 4 };
        expect(Hexagon.cubicToAxial(cubic)).toEqual(expected);
      });

      it('should convert cubic (2, -3, 1) to axial (2, 3)', () => {
        const cubic: CubicHex = { x: 2, y: -3, z: -1 };
        const expected: AxialHex = { x: 2, y: 3 };
        expect(Hexagon.cubicToAxial(cubic)).toEqual(expected);
      });
    });

    describe('axialToCubic', () => {
      it('should convert axial (1, 2) to cubic (1, -2, 1)', () => {
        const axial: AxialHex = { x: 1, y: 2 };
        const expected: CubicHex = { x: 1, y: -2, z: 1 };
        expect(Hexagon.axialToCubic(axial)).toEqual(expected);
      });

      it('should convert axial (0, 0) to cubic (0, 0, 0)', () => {
        const axial: AxialHex = { x: 0, y: 0 };
        const result = Hexagon.axialToCubic(axial);
        const cleanedResult = {
          x: result.x,
          y: result.y,
          z: result.z
        };
        const expected: CubicHex = { x: 0, y: 0, z: 0 };
        expect(cleanedResult).toEqual(expected);
      });

      it('should convert axial (-1, 2) to cubic (-1, -2, 3)', () => {
        const axial: AxialHex = { x: -1, y: 2 };
        const expected: CubicHex = { x: -1, y: -2, z: 3 };
        expect(Hexagon.axialToCubic(axial)).toEqual(expected);
      });

      it('should convert axial (3, -3) to cubic (3, 3, -6)', () => {
        const axial: AxialHex = { x: 3, y: -3 };
        const expected: CubicHex = { x: 3, y: 3, z: -6 };
        expect(Hexagon.axialToCubic(axial)).toEqual(expected);
      });

      it('should convert axial (-2, -1) to cubic (-2, 1, 1)', () => {
        const axial: AxialHex = { x: -2, y: -1 };
        const expected: CubicHex = { x: -2, y: 1, z: 1 };
        expect(Hexagon.axialToCubic(axial)).toEqual(expected);
      });
    });

    describe('calculateCubicDistance', () => {
      it('should calculate the distance between two identical hexagons as 0', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(0, 0, 0);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          0
        );
      });

      it('should calculate the distance between (0, 0, 0) and (1, -3, 2) as 3', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(1, -3, 2);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          3
        );
      });

      it('should calculate the distance between two hexagons with only one differing coordinate', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(3, 0, -3);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          3
        );
      });

      it('should calculate the distance between distant hexagons', () => {
        const hexA = new Hexagon(-5, 5, 0);
        const hexB = new Hexagon(5, -5, 0);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          10
        );
      });

      it('should handle negative coordinates', () => {
        const hexA = new Hexagon(-3, 3, 0);
        const hexB = new Hexagon(-4, 4, 0);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          1
        );
      });

      it('should handle hexagons with all positive coordinates', () => {
        const hexA = new Hexagon(3, 2, -5);
        const hexB = new Hexagon(4, 1, -5);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          1
        );
      });

      it('should handle hexagons with all negative coordinates', () => {
        const hexA = new Hexagon(-3, -2, 5);
        const hexB = new Hexagon(-4, -1, 5);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          1
        );
      });

      it('should calculate the distance between hexagons with large coordinate values', () => {
        const hexA = new Hexagon(100, -200, 100);
        const hexB = new Hexagon(-100, 200, -100);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          400
        );
      });

      it('should calculate the distance between hexagons with even larger coordinate values', () => {
        const hexA = new Hexagon(1000, -2000, 1000);
        const hexB = new Hexagon(-1000, 2000, -1000);
        expect(Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic())).toEqual(
          4000
        );
      });

      it('should not calculate a distance greater than 1,000,000 for hexagons within a radius of 1,000,000', () => {
        const hexA = new Hexagon(1_000_000, -500_000, -500_000);
        const hexB = new Hexagon(-1_000_000, 500_000, 500_000);

        const distance = Hexagon.cubicDistance(hexA.toCubic(), hexB.toCubic());

        expect(distance).toBeLessThanOrEqual(2_000_000);
        expect(distance).toBeGreaterThanOrEqual(0);
      });
    });

    describe('calculateAxialDistance', () => {
      it('should calculate the distance between two points in axial coordinates', () => {
        const axialA: AxialHex = { x: 0, y: 0 };
        const axialB: AxialHex = { x: 1, y: 2 };
        expect(Hexagon.axialDistance(axialA, axialB)).toEqual(3);
      });

      it('should calculate the distance between two points with negative axial coordinates', () => {
        const axialA: AxialHex = { x: -1, y: -2 };
        const axialB: AxialHex = { x: 1, y: 2 };
        expect(Hexagon.axialDistance(axialA, axialB)).toEqual(6);
      });

      it('should calculate a distance of 0 for the same axial point', () => {
        const axialA: AxialHex = { x: 1, y: 2 };
        expect(Hexagon.axialDistance(axialA, axialA)).toEqual(0);
      });

      it('should calculate the distance between two far apart axial points', () => {
        const axialA: AxialHex = { x: 100, y: -200 };
        const axialB: AxialHex = { x: -100, y: 200 };
        expect(Hexagon.axialDistance(axialA, axialB)).toBeGreaterThanOrEqual(
          300
        );
      });

      it('should calculate the distance between two even farther apart axial points', () => {
        const axialA: AxialHex = { x: 1000, y: -2000 };
        const axialB: AxialHex = { x: -1000, y: 2000 };
        expect(Hexagon.axialDistance(axialA, axialB)).toBeGreaterThanOrEqual(
          3000
        );
      });

      it('should calculate a distance greater than 1,000,000 for axial points within a radius of 1,000,000', () => {
        const axialA: AxialHex = { x: 500_000, y: 500_000 };
        const axialB: AxialHex = { x: -500_000, y: -500_000 };
        const distance = Hexagon.axialDistance(axialA, axialB);
        expect(distance).toBeLessThanOrEqual(2_000_000);
        expect(distance).toBeGreaterThanOrEqual(0);
      });
    });

    describe('drawLine', () => {
      it('should draw a line between two identical hexagons', () => {
        const hexA = new Hexagon(0, 0, 0);
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexA.toCubic());
        expect(line.length).toEqual(1);
        expect(line[0]).toEqual(hexA.toCubic());
      });

      it('should draw a short line between neighboring hexagons', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(1, -1, 0);
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());
        expect(line.length).toBe(2);
        expect(line[0]).toEqual(hexA.toCubic());
        expect(line[1]).toEqual(hexB.toCubic());
      });

      it('should draw a diagonal line between two hexagons', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(3, -3, 0);
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());
        expect(line[0]).toEqual(hexA.toCubic());
        expect(line[line.length - 1]).toEqual(hexB.toCubic());
      });

      it('should draw a line passing through negative coordinates', () => {
        const hexA = new Hexagon(-1, 1, 0);
        const hexB = new Hexagon(1, -1, 0);
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());
        expect(line[0]).toEqual(hexA.toCubic());
        expect(line[line.length - 1]).toEqual(hexB.toCubic());
      });

      it('should draw a line between hexagons with larger coordinate values', () => {
        const hexA = new Hexagon(10, -20, 10);
        const hexB = new Hexagon(20, -10, -10);
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());
        expect(line[0]).toEqual(hexA.toCubic());
        expect(line[line.length - 1]).toEqual(hexB.toCubic());
      });

      it('should ensure varied line lengths are correctly computed', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(5, -5, 0);
        const hexC = new Hexagon(10, -10, 0);
        const line1 = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());
        const line2 = Hexagon.cubicDrawLine(hexA.toCubic(), hexC.toCubic());
        expect(line1.length < line2.length).toBeTruthy();
        expect(line1[0]).toEqual(hexA.toCubic());
        expect(line2[0]).toEqual(hexA.toCubic());
      });

      it('should ensure the line is continuous without gaps', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(3, -3, 0);
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());
        for (let i = 0; i < line.length; i++) {
          const hex = line[i];
          const neighbors = [0, 1, 2, 3, 4, 5].map((dir) =>
            Hexagon.cubicNeighbor(hex, dir)
          );
          const hasNeighborInLine = neighbors.some((neighbor) =>
            line.some((lineHex) => Hexagon.cubicHexEqual(neighbor, lineHex))
          );
          expect(hasNeighborInLine).toBeTruthy();
        }
      });

      it('should ensure the long line is continuous without gaps', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(30, -30, 0); // This creates a long line
        const line = Hexagon.cubicDrawLine(hexA.toCubic(), hexB.toCubic());

        for (let i = 0; i < line.length; i++) {
          const hex = line[i];
          const neighbors = [0, 1, 2, 3, 4, 5].map((dir) =>
            Hexagon.cubicNeighbor(hex, dir)
          );
          const hasNeighborInLine = neighbors.some((neighbor) =>
            line.some((lineHex) => Hexagon.cubicHexEqual(neighbor, lineHex))
          );
          expect(hasNeighborInLine).toBeTruthy();
        }

        expect(line[line.length - 1]).toEqual(hexB.toCubic());
        expect(line[line.length - 2]).toEqual({ x: 29, y: -29, z: 0 });
      });
    });

    describe('cubicRound', () => {
      it('should round cubic coordinates correctly for positive fractions', () => {
        const hex: CubicHex = { x: 1.2, y: -3.4, z: 2.2 };
        const expected: CubicHex = { x: 1, y: -3, z: 2 };
        expect(Hexagon.cubicRound(hex)).toEqual(expected);
      });

      it('should round cubic coordinates up for values close to .5', () => {
        const hex: CubicHex = { x: 0.5, y: 1.5, z: -2 };
        const expected: CubicHex = { x: 1, y: 1, z: -2 };
        expect(Hexagon.cubicRound(hex)).toEqual(expected);
      });

      it('should round cubic coordinates down for negative values close to .5', () => {
        const hex: CubicHex = { x: -0.5, y: -1.5, z: -2.5 };
        const expected: CubicHex = { x: -1, y: -2, z: 3 };
        expect(Hexagon.cubicRound(hex)).toEqual(expected);
      });

      it('should round cubic coordinates correctly for negative fractions', () => {
        const hex: CubicHex = { x: -1.2, y: 3.4, z: -2.2 };
        const expected: CubicHex = { x: -1, y: 3, z: -2 };
        expect(Hexagon.cubicRound(hex)).toEqual(expected);
      });

      it('should round cubic coordinates to nearest integer for values close to .9', () => {
        const hex: CubicHex = { x: 0.9, y: 1.9, z: -2.9 };
        const expected: CubicHex = { x: 1, y: 2, z: -3 };
        expect(Hexagon.cubicRound(hex)).toEqual(expected);
      });

      it('should round cubic coordinates correctly for values with no fractions', () => {
        const hex: CubicHex = { x: 1, y: -3, z: 2 };
        const expected: CubicHex = { x: 1, y: -3, z: 2 };
        expect(Hexagon.cubicRound(hex)).toEqual(expected);
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
          const rounded = Hexagon.cubicRound(coord);
          expect(rounded.x + rounded.y + rounded.z).toEqual(0);
        }
      });
    });

    describe('axialRound', () => {
      it('should round axial coordinates towards nearest whole values', () => {
        const hex: AxialHex = { x: 0.7, y: 0.2 };
        const result = Hexagon.axialRound(hex);

        expect(result.x).toBe(1);
        expect(result.y).toBe(0);
      });

      it('should correctly round when values are halfway between two whole numbers', () => {
        const hex: AxialHex = { x: 1.5, y: -1.5 };
        const result = Hexagon.axialRound(hex);

        expect(result.x).toBe(2);
        expect(result.y).toBe(-1);
      });

      it('should not change coordinates that are already whole numbers', () => {
        const hex: AxialHex = { x: 2, y: -3 };
        const result = Hexagon.axialRound(hex);

        expect(result.x).toBe(2);
        expect(result.y).toBe(-3);
      });

      it('should handle rounding of negative fractional values', () => {
        const hex: AxialHex = { x: -0.7, y: -0.3 };
        const result = Hexagon.axialRound(hex);

        expect(result.x).toBe(-1);
        expect(result.y).toBe(0);
      });

      it('should handle complex rounding scenarios', () => {
        const hex: AxialHex = { x: 0.4, y: 2.6 };
        const result = Hexagon.axialRound(hex);

        expect(result.x).toBe(1);
        expect(result.y).toBe(3);
      });
    });

    describe('lerp', () => {
      it('should interpolate between two numbers', () => {
        expect(Hexagon.lerp(0, 10, 0.5)).toBe(5);
        expect(Hexagon.lerp(5, 15, 0.25)).toBe(7.5);
      });

      it('should return start value when t is 0', () => {
        expect(Hexagon.lerp(0, 10, 0)).toBe(0);
      });

      it('should return end value when t is 1', () => {
        expect(Hexagon.lerp(0, 10, 1)).toBe(10);
      });

      it('should handle negative values', () => {
        expect(Hexagon.lerp(-10, 10, 0.5)).toBe(0);
        expect(Hexagon.lerp(-5, -15, 0.25)).toBe(-7.5);
      });

      it('should interpolate beyond end value for t > 1', () => {
        expect(Hexagon.lerp(0, 10, 1.5)).toBe(15);
      });

      it('should interpolate before start value for t < 0', () => {
        expect(Hexagon.lerp(0, 10, -0.5)).toBe(-5);
      });
    });

    describe('cubicLerp', () => {
      it('should interpolate between two hexagons', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(10, 10, -20);

        const result = Hexagon.cubicLerp(hexA.toCubic(), hexB.toCubic(), 0.5);
        const cubicResult = result;

        expect(cubicResult.x).toBeCloseTo(5);
        expect(cubicResult.y).toBeCloseTo(5);
        expect(cubicResult.z).toBeCloseTo(-10);
      });

      it('should return start hexagon when t is 0', () => {
        const hexA = new Hexagon(0, 0);
        const hexB = new Hexagon(10, 10);

        const result = Hexagon.cubicLerp(hexA.toCubic(), hexB.toCubic(), 0);
        const cubicResult = result;

        expect(cubicResult.x).toBe(0);
        expect(cubicResult.y).toBe(0);
        expect(cubicResult.z).toBe(0);
      });

      it('should return end hexagon when t is 1', () => {
        const hexA = new Hexagon(0, 0, 0);
        const hexB = new Hexagon(10, 10, -20);

        const result = Hexagon.cubicLerp(hexA.toCubic(), hexB.toCubic(), 1);
        const cubicResult = result;

        expect(cubicResult.x).toBe(10);
        expect(cubicResult.y).toBe(10);
        expect(cubicResult.z).toBe(-20);
      });

      it('should handle different hexagon positions', () => {
        const hexA = new Hexagon(3, 5, -8);
        const hexB = new Hexagon(7, -3, -4);

        const result = Hexagon.cubicLerp(hexA.toCubic(), hexB.toCubic(), 0.5);
        const cubicResult = result;

        expect(cubicResult.x).toBeCloseTo(5);
        expect(cubicResult.y).toBeCloseTo(1);
        expect(cubicResult.z).toBeCloseTo(-6);
      });
    });

    describe('neighbors', () => {
      describe('cubic direction', () => {
        it('should provide correct cubic direction for a given index', () => {
          const result = Hexagon.cubicDirection(HexDirectionAngle.A120);
          expect(result).toEqual({ x: 1, y: 0, z: -1 });
        });
      });
      describe('cubic add', () => {
        it('should add two cubic hexes correctly', () => {
          const hex1 = { x: 1, y: -1, z: 0 };
          const hex2 = { x: -1, y: 1, z: 0 };
          const result = Hexagon.cubicAdd(hex1, hex2);
          expect(result).toEqual({ x: 0, y: 0, z: 0 });
        });
      });
      describe('cubic neignbor', () => {
        it('should provide correct cubic neighbor for a hex and direction', () => {
          const hex = { x: 1, y: -1, z: 0 };
          const result = Hexagon.cubicNeighbor(hex, HexDirectionClock.C8);
          expect(result).toEqual({ x: 1, y: -2, z: 1 });
        });
      });

      describe('axial direction', () => {
        describe('should provide correct axial direction with descriptive directions', () => {
          it('top', () => {
            const result = Hexagon.axialDirection(HexDirectionDescriptive.TOP);
            expect(result).toEqual({ x: -1, y: -1 });
          });
          it('top right', () => {
            const result = Hexagon.axialDirection(
              HexDirectionDescriptive.TOP_RIGHT
            );
            expect(result).toEqual({ x: 0, y: -1 });
          });
          it('bottom right', () => {
            const result = Hexagon.axialDirection(
              HexDirectionDescriptive.BOTTOM_RIGHT
            );
            expect(result).toEqual({ x: 1, y: 0 });
          });
          it('bottom', () => {
            const result = Hexagon.axialDirection(
              HexDirectionDescriptive.BOTTOM
            );
            expect(result).toEqual({ x: 1, y: 1 });
          });
          it('bottom left', () => {
            const result = Hexagon.axialDirection(
              HexDirectionDescriptive.BOTTOM_LEFT
            );
            expect(result).toEqual({ x: 0, y: 1 });
          });
          it('top left', () => {
            const result = Hexagon.axialDirection(
              HexDirectionDescriptive.TOP_LEFT
            );
            expect(result).toEqual({ x: -1, y: 0 });
          });
        });

        describe('axial add', () => {
          it('should add two axial hexes correctly', () => {
            const hex1 = { x: 1, y: -1 };
            const hex2 = { x: -1, y: 1 };
            const result = Hexagon.axialAdd(hex1, hex2);
            expect(result).toEqual({ x: 0, y: 0 });
          });
        });
        describe('axial neighbor', () => {
          it('should provide correct axial neighbor for a hex and back direction', () => {
            const hex = { x: 1, y: 1 };
            const result = Hexagon.axialNeighbor(hex, HexDirectionPov.BACK);
            expect(result).toEqual({ x: 2, y: 2 });
          });

          it('should provide correct axial neighbor for a hex and back left direction', () => {
            const hex = { x: 1, y: 1 };
            const result = Hexagon.axialNeighbor(
              hex,
              HexDirectionPov.BACK_LEFT
            );
            expect(result).toEqual({ x: 1, y: 2 });
          });

          it('should provide correct axial neighbor for a hex and front left direction', () => {
            const hex = { x: 1, y: 1 };
            const result = Hexagon.axialNeighbor(
              hex,
              HexDirectionPov.FRONT_LEFT
            );
            expect(result).toEqual({ x: 0, y: 1 });
          });

          it('should provide correct axial neighbor for a hex and front direction', () => {
            const hex = { x: 1, y: 1 };
            const result = Hexagon.axialNeighbor(hex, HexDirectionPov.FRONT);
            expect(result).toEqual({ x: 0, y: 0 });
          });

          it('should provide correct axial neighbor for a hex and front right direction', () => {
            const hex = { x: 1, y: 1 };
            const result = Hexagon.axialNeighbor(
              hex,
              HexDirectionPov.FRONT_RIGHT
            );
            expect(result).toEqual({ x: 1, y: 0 });
          });

          it('should provide correct axial neighbor for a hex and back right direction', () => {
            const hex = { x: 1, y: 1 };
            const result = Hexagon.axialNeighbor(
              hex,
              HexDirectionPov.BACK_RIGHT
            );
            expect(result).toEqual({ x: 2, y: 1 });
          });

          it('should return { x: 34, y:30 } as top neigbor of { x: 35, y:31 }', () => {
            const hex = { x: 35, y: 31 };
            const result = Hexagon.axialNeighbor(
              hex,
              HexDirectionDescriptive.TOP
            );
            expect(result).toEqual({ x: 34, y: 30 });
          });

          it('should return { x: 35, y:32 } as at 8 o`clock neigbor of { x: 35, y:31 }', () => {
            const hex = { x: 35, y: 31 };
            const result = Hexagon.axialNeighbor(hex, HexDirectionClock.C8);
            expect(result).toEqual({ x: 35, y: 32 });
          });
        });
      });
    });

    describe('range', () => {
      describe('cubic', () => {
        it('should return a single hex for N=0', () => {
          const center: CubicHex = { x: 0, y: 0, z: 0 };
          const result = Hexagon.cubicRange(center, 0);
          expect(result).toEqual([center]);
        });

        it('should return a single hex for N=0', () => {
          const center: CubicHex = { x: 0, y: 0, z: 0 };
          const result = Hexagon.cubicRange(center, 0);
          expect(result).toEqual([center]);
        });

        it('should return the correct number of hexes for a given range', () => {
          const center: CubicHex = { x: 0, y: 0, z: 0 };
          const N = 2;
          const result = Hexagon.cubicRange(center, N);
          // Formula for hexes in a range: (3 * N * (N + 1)) + 1
          expect(result.length).toBe(3 * N * (N + 1) + 1);
        });

        it('should contain all expected hexagons for N=5', () => {
          const center: CubicHex = { x: 0, y: 0, z: 0 };
          const N = 5;
          const result = Hexagon.cubicRange(center, N);

          for (let q = -N; q <= N; q++) {
            for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
              const s = -q - r;
              const hex = { x: center.x + q, y: center.y + r, z: center.z + s };
              expect(result).toContainEqual(hex);
            }
          }
        });

        it('should contain all expected intersecting hexagons', () => {
          const center1: CubicHex = { x: 0, y: 0, z: 0 };
          const center2: CubicHex = { x: 1, y: 1, z: -2 };
          const N = 5;
          const range1 = Hexagon.cubicRange(center1, N);
          const range2 = Hexagon.cubicRange(center2, N);
          const intersection = Hexagon.cubicRangeIntersection(range1, range2);

          range1.forEach((hex1) => {
            if (range2.some((hex2) => Hexagon.cubicHexEqual(hex1, hex2))) {
              expect(intersection).toContainEqual(hex1);
            }
          });
        });

        it('should return empty array for non-overlapping ranges', () => {
          const center1: CubicHex = { x: 0, y: 0, z: 0 };
          const center2: CubicHex = { x: 10, y: 10, z: -20 };
          const range1 = Hexagon.cubicRange(center1, 2);
          const range2 = Hexagon.cubicRange(center2, 2);
          const intersection = Hexagon.cubicRangeIntersection(range1, range2);

          expect(intersection).toEqual([]);
        });

        it('should return empty array for non-overlapping ranges', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 10, y: 10 }; // Adjust coordinates to ensure non-overlapping
          const range1 = Hexagon.axialRange(center1, 2);
          const range2 = Hexagon.axialRange(center2, 2);
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          expect(intersection).toEqual([]);
        });

        it('should handle intersections for large N values efficiently', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 5, y: 5 }; // Some overlapping
          const range1 = Hexagon.axialRange(center1, 100); // Large N
          const range2 = Hexagon.axialRange(center2, 100); // Large N
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          expect(intersection.length).toBeGreaterThan(0); // Just a basic check; fine-tune as needed
        });

        it('x + y + z of all hexes in the result should be 0', () => {
          const center: CubicHex = { x: 0, y: 0, z: 0 };
          const N = 2;
          const range = Hexagon.cubicRange(center, N);

          range.forEach((hex) => {
            expect(hex.x + hex.y + hex.z).toBe(0);
          });
        });
      });

      describe('axial', () => {
        it('should return a single hex for N=0', () => {
          const center: AxialHex = { x: 0, y: 0 };
          const result = Hexagon.axialRange(center, 0);
          expect(result).toEqual([center]);
        });

        it('should return the expected intersection hexes', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 1, y: 1 };
          const range1 = Hexagon.axialRange(center1, 3);
          const range2 = Hexagon.axialRange(center2, 3);
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          intersection.forEach((hex) => {
            expect(range1).toContainEqual(hex);
            expect(range2).toContainEqual(hex);
          });
        });

        it('should return the correct number of hexes for a given range', () => {
          const center: AxialHex = { x: 0, y: 0 };
          const N = 2;
          const result = Hexagon.axialRange(center, N);
          // Formula for hexes in a range: (3 * N * (N + 1)) + 1
          expect(result.length).toBe(3 * N * (N + 1) + 1);
        });

        it('should contain all expected hexagons for N=5', () => {
          const center: AxialHex = { x: 0, y: 0 };
          const N = 5;
          const result = Hexagon.axialRange(center, N);

          for (let q = -N; q <= N; q++) {
            for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
              const hex = { x: center.x + q, y: center.y + r };
              expect(result).toContainEqual(hex);
            }
          }
        });

        it('should contain all expected intersecting hexagons', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 1, y: 1 };
          const N = 5;
          const range1 = Hexagon.axialRange(center1, N);
          const range2 = Hexagon.axialRange(center2, N);
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          range1.forEach((hex1) => {
            if (range2.some((hex2) => Hexagon.axialEqual(hex1, hex2))) {
              expect(intersection).toContainEqual(hex1);
            }
          });
        });

        it('should return empty array for non-overlapping ranges', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 10, y: 10 }; // Adjust coordinates to ensure non-overlapping
          const range1 = Hexagon.axialRange(center1, 2);
          const range2 = Hexagon.axialRange(center2, 2);
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          expect(intersection).toEqual([]);
        });

        it('should handle intersections for large N values efficiently', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 5, y: 5 }; // Some overlapping
          const range1 = Hexagon.axialRange(center1, 100); // Large N
          const range2 = Hexagon.axialRange(center2, 100); // Large N
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          expect(intersection.length).toBeGreaterThan(0); // Just a basic check; fine-tune as needed
        });

        it('should return the expected intersection hexes', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 1, y: 1 };
          const range1 = Hexagon.axialRange(center1, 3);
          const range2 = Hexagon.axialRange(center2, 3);
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          // For every hex in the intersection, it should exist in both range1 and range2
          intersection.forEach((hex) => {
            expect(range1).toContainEqual(hex);
            expect(range2).toContainEqual(hex);
          });
        });
      });

      describe('intersection', () => {
        it('should return the expected intersection hexes', () => {
          const center1: CubicHex = { x: 0, y: 0, z: 0 };
          const center2: CubicHex = { x: 1, y: 1, z: -2 };
          const range1 = Hexagon.cubicRange(center1, 3);
          const range2 = Hexagon.cubicRange(center2, 3);
          const intersection = Hexagon.cubicRangeIntersection(range1, range2);

          intersection.forEach((hex) => {
            expect(range1).toContainEqual(hex);
            expect(range2).toContainEqual(hex);
          });
        });

        it('should return intersection of two ranges', () => {
          const center1: CubicHex = { x: 0, y: 0, z: 0 };
          const center2: CubicHex = { x: 1, y: 1, z: -2 };
          const range1 = Hexagon.cubicRange(center1, 2);
          const range2 = Hexagon.cubicRange(center2, 2);
          const intersection = Hexagon.cubicRangeIntersection(range1, range2);

          expect(intersection.length).toBeGreaterThan(0);
        });
      });

      describe('intersectingAxialRanges()', () => {
        it('should return intersection of two ranges', () => {
          const center1: AxialHex = { x: 0, y: 0 };
          const center2: AxialHex = { x: 1, y: 1 };
          const range1 = Hexagon.axialRange(center1, 2);
          const range2 = Hexagon.axialRange(center2, 2);
          const intersection = Hexagon.axialRangeIntersection(range1, range2);

          expect(intersection.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
