interface Logger {
  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  trace(message: string, meta?: any): void;
}

class DevLogger implements Logger {
  constructor() {
    this.lastTraceTime = Date.now();
  }

  info(message: string, meta?: any) {
    console.log(
      '%cinfo:',
      'color: blue; background-color: lightgrey',
      message,
      { timestamp: Date.now(), ...meta }
    );
  }

  error(message: string, meta?: any) {
    console.error(message, { timestamp: Date.now(), ...meta });
  }

  warn(message: string, meta?: any) {
    console.warn('warn: ', message, { timestamp: Date.now(), ...meta });
  }

  debug(message: string, meta?: any) {
    console.debug(
      '%cdebug:',
      'color: orange; background-color: grey',
      message,
      { timestamp: Date.now(), ...meta }
    );
  }

  private lastTraceTime: number;

  trace(message: string, meta?: any) {
    const now = Date.now();
    (meta?.showCallStack ? console.trace : console.debug)(
      '%ctrace:',
      'color: pink;' + ' background-color: grey',
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
  info(message: string, meta?: any) {}
  error(message: string, meta?: any) {}
  warn(message: string, meta?: any) {}
  debug(message: string, meta?: any) {}
  trace(message: string, meta?: any) {}
}

export default process.env.NODE_ENV === 'development'
  ? new DevLogger()
  : new ProdLogger();
