import { writeFile } from 'fs/promises';
import {
  SECOND,
  STATS_SAVE_INTERVAL,
  TICK_TIME_STATS_DIR
} from '../../lib/utils/constants';
import { Stats, StatsGroups } from '../../lib/utils/types';
import logger from '../../lib/utils/logger';
import { mkdirSync } from 'fs';
import characterAtWorldStore from '../../store/character-at-world-store';
import encounterStore from '../../store/encounter-store';

export const stats: Stats = {
  [StatsGroups.TICK]: []
};

export const withStats = (f: () => void, group: StatsGroups) => {
  logger.warn('Statistics enabled!');
  mkdirSync(`${TICK_TIME_STATS_DIR}/${StatsGroups.TICK}`, { recursive: true });
  setInterval(saveTickStats, STATS_SAVE_INTERVAL * SECOND);

  return () => {
    const tickStartTime = Date.now();

    f();

    const tickEndTime = Date.now();
    const executionTime = tickEndTime - tickStartTime;
    stats[group].push({
      executionTime,
      charactersCount: characterAtWorldStore.size(),
      encountersCount: encounterStore.size()
    });
  };
};

export function saveTickStats() {
  writeFile(
    `${TICK_TIME_STATS_DIR}/${StatsGroups.TICK}/${Date.now()}`,
    stats[StatsGroups.TICK]
      .map((tickStats) =>
        [
          tickStats.executionTime,
          tickStats.charactersCount,
          tickStats.encountersCount
        ].join(',')
      )
      .join('\n')
  ).catch((error) => logger.error('Error during saving tick stats', { error }));
  stats[StatsGroups.TICK] = [];
}
