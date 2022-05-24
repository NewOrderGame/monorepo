import * as express from 'express';
import * as moment from 'moment';
import { readdirSync, readFileSync } from 'fs';
import { TICK_TIME_STATS_DIR } from '../utils/constants';
import logger from '../utils/logger';
import { resolve } from 'path';

const PORT = 5050;
const app = express();

type TickStats = {
  timestamp: number;
  date: string;
  min: number;
  avg: number;
  max: number;
};

app.use(express.static(resolve(__dirname, 'public')));

app.get('/tick-time', (request, response) => {
  const stats = logTickStats();
  response.send(stats);
});

app.listen(PORT, () => {
  logger.info('Started stats reader server', { PORT });
});

export function logTickStats(): TickStats[] {
  const tickTimeStats = readdirSync(TICK_TIME_STATS_DIR);
  return tickTimeStats.reduce((result, timestamp) => {
    const b: Buffer = readFileSync(`${TICK_TIME_STATS_DIR}/${timestamp}`);
    const s: string = b.toString();
    const as: string[] = s.split('\n');
    const an: number[] = as.map((string) => Number(string));

    const min = Math.min(...an);
    const avg = an.reduce((a, b) => a + b, 0) / an.length;
    const max = Math.max(...an);

    return [
      ...result,
      {
        timestamp: Number(timestamp),
        date: moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss'),
        min,
        avg,
        max
      }
    ];
  }, []);
}
