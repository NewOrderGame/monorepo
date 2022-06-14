import * as express from 'express';
import { resolve } from 'path';
import logger from '../../lib/utils/logger';
import { getTickTimeStats } from './reader';
import { TICK_TIME_STATS_DIR } from '../../lib/utils/constants';
import { StatsGroups } from '../../lib/utils/types';

const PORT = 5050;
const app = express();

app.use(express.static(resolve(__dirname, 'public')));

app.get('/stats', (request, response) => {
  response.send(getTickTimeStats(`${TICK_TIME_STATS_DIR}/${StatsGroups.TICK}`));
});

app.listen(PORT, () => {
  logger.info('Started stats reader server', { PORT });
});
