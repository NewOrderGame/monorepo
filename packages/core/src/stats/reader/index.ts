import express from 'express';
import { resolve } from 'path';
import { logger } from '@newordergame/common';
import { getTickTimeStats } from './reader';
import { TICK_TIME_STATS_DIR } from '../../lib/constants';
import { StatsGroups } from '../../lib/types';

const PORT = 5050;
const app = express();

app.use(express.static(resolve(__dirname, 'public')));

app.get('/stats', (request, response) => {
  response.send(getTickTimeStats(`${TICK_TIME_STATS_DIR}/${StatsGroups.TICK}`));
});

app.listen(PORT, () => {
  logger.info({ PORT }, 'Started stats reader server');
});
