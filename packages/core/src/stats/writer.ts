import { Stats } from '../utils/types';
import { argv } from '../utils/argv';
import { mkdirSync, writeFileSync } from 'fs';
import {
  SECOND,
  STATS_SAVE_INTERVAL,
  TICK_TIME_STATS_DIR
} from '../utils/constants';
import logger from '../utils/logger';

const stats: Stats = {
  tickTime: []
};

export const withStats = (f: () => void) => {
  logger.warn('Statistics enabled!');
  mkdirSync(TICK_TIME_STATS_DIR, { recursive: true });
  setInterval(saveTickStats, STATS_SAVE_INTERVAL * SECOND);

  return () => {
    const tickStartTime = Date.now();

    f();

    const tickEndTime = Date.now();
    const tickTime = tickEndTime - tickStartTime;
    stats.tickTime.push(tickTime);
  };
};

function saveTickStats() {
  writeFileSync(
    `${TICK_TIME_STATS_DIR}/${Date.now()}`,
    stats.tickTime.join('\n')
  );
  stats.tickTime = [];
}
