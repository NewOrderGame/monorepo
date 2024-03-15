import minimist from 'minimist';
import { logger } from '@newordergame/common';

export const argv = minimist(process.argv.slice(2));

logger.debug({ argv }, 'argv');
