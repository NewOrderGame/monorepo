import { transports, createLogger, format } from 'winston';

const logger = createLogger();

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.Console({ level: 'info', format: format.simple() })
  );
} else {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: format.simple()
    })
  );
}

export default logger;
