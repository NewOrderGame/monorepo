import pino from 'pino';

const l = pino();
l.level = 'trace';

export const logger = l;
