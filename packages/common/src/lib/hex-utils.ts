import { CubicHex } from './cubic-hex';
import { abs, subtract, max, round, evaluate, divide } from 'mathjs';

export const calculateDistance = (hexA: CubicHex, hexB: CubicHex): number => {
  const vX = abs(subtract(hexA.getX(), hexB.getX()));
  const vY = abs(subtract(hexA.getY(), hexB.getY()));
  const vZ = abs(subtract(hexA.getZ(), hexB.getZ()));
  return max(vX, vY, vZ);
};

export const drawLine = (hexA: CubicHex, hexB: CubicHex): CubicHex[] => {
  const distance = calculateDistance(hexA, hexB);
  const line: CubicHex[] = [];
  for (let i = 0; i <= distance; i++) {
    const multiplier = divide(i, distance);
    const x = round(
      evaluate(
        `(${hexA.getX()} + (${hexB.getX()} - ${hexA.getX()}) * ${multiplier})`
      )
    );
    const z = round(
      evaluate(
        `(${hexA.getZ()} + (${hexB.getZ()} - ${hexA.getZ()}) * ${multiplier}) - 0.001`
      )
    );
    const y = evaluate(`-${x} -${z}`);
    line.push(new CubicHex(x, y, z));
  }
  return line;
};
