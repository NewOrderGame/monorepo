import { CubicHex } from './cubic-hex';

export const calculateDistance = (hexA: CubicHex, hexB: CubicHex): number => {
  const vX = Math.abs(hexA.getX() - hexB.getX());
  const vY = Math.abs(hexA.getY() - hexB.getY());
  const vZ = Math.abs(hexA.getZ() - hexB.getZ());
  return Math.max(vX, vY, vZ);
};

export const calculateLine = (hexA: CubicHex, hexB: CubicHex): CubicHex[] => {
  const distance = calculateDistance(hexA, hexB);
  const line: CubicHex[] = [];
  for (let i = 0; i <= distance; i++) {
    const multiplier = i / distance;
    const x = Math.round(
      hexA.getX() + (hexB.getX() - hexA.getX()) * multiplier
    );
    const y = Math.round(
      hexA.getY() + (hexB.getY() - hexA.getY()) * multiplier
    );
    const z = Math.round(
      hexA.getZ() + (hexB.getZ() - hexA.getZ()) * multiplier
    );
    line.push(new CubicHex(x, y, z));
  }
  return line;
};
