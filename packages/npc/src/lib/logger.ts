import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

logger.on('level-change', (lvl, val, prevLvl, prevVal) => {
  console.log('%s (%d) was changed to %s (%d)', prevLvl, prevVal, lvl, val);
});

logger.level = 'trace';

export default logger;
