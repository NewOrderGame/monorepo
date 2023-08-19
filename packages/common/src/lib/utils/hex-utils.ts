import { Hexagon } from '../hexagon';
import { abs, subtract, max, round, evaluate, divide } from 'mathjs';

export default class HexUtils {
  static calculateDistance(hexA: Hexagon, hexB: Hexagon): number {
    const vX = abs(subtract(hexA.getX(), hexB.getX()));
    const vY = abs(subtract(hexA.getY(), hexB.getY()));
    const vZ = abs(subtract(hexA.getZ(), hexB.getZ()));
    return max(vX, vY, vZ);
  }

  static drawLine(hexA: Hexagon, hexB: Hexagon): Hexagon[] {
    const distance = this.calculateDistance(hexA, hexB);
    const line: Hexagon[] = [];
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
      line.push(new Hexagon(x, y, z));
    }
    return line;
  }
}
