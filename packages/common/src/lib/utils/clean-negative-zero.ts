const cleanNegativeZero = (zero: number): number => {
  if (Object.is(zero, -0)) return 0;
  return zero;
};

export default cleanNegativeZero;
