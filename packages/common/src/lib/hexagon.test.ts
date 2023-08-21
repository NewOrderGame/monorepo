import { Hexagon } from './hexagon';

describe.only('Hexagon', () => {
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
});
