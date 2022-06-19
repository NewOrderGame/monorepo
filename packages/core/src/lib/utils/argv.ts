import * as minimist from 'minimist';
import logger from './logger';

export const argv = minimist(process.argv.slice(2));

logger.debug({ argv }, 'argv');
