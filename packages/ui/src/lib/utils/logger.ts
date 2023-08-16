interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, meta?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, meta?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, meta?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, meta?: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(message: string, meta?: any): void;
}

class DevLogger implements Logger {
  constructor() {
    this.lastTraceTime = Date.now();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, meta?: any) {
    console.log(
      '%cinfo:',
      'color: blue; background-color: lightgrey',
      message,
      { timestamp: Date.now(), ...meta }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, meta?: any) {
    console.error(message, { timestamp: Date.now(), ...meta });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, meta?: any) {
    console.warn('warn: ', message, { timestamp: Date.now(), ...meta });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, meta?: any) {
    console.debug(
      '%cdebug:',
      'color: orange; background-color: grey',
      message,
      { timestamp: Date.now(), ...meta }
    );
  }

  private lastTraceTime: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(message: string, meta?: any) {
    const now = Date.now();
    (meta?.showCallStack ? console.trace : console.debug)(
      '%ctrace:',
      'color: pink; background-color: grey',
      message,
      {
        timestamp: now,
        lastTraceTime: this.lastTraceTime,
        diff: now - this.lastTraceTime,
        ...meta
      }
    );
    this.lastTraceTime = now;
  }
}

class ProdLogger implements Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  info(message: string, meta?: any) {
    // noop
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  error(message: string, meta?: any) {
    // noop
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  warn(message: string, meta?: any) {
    // noop
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  debug(message: string, meta?: any) {
    // noop
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  trace(message: string, meta?: any) {
    // noop
  }
}

export default process.env.NODE_ENV === 'development'
  ? new DevLogger()
  : new ProdLogger();
