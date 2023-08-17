interface Logger {
  info(message: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(meta: any, message: string): void;

  error(message: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(meta: any, message: string): void;

  warn(message: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(meta: any, message: string): void;

  debug(message: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(meta: any, message: string): void;

  trace(message: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(meta: any, message: string): void;
}

class DevLogger implements Logger {
  constructor() {
    this.lastTraceTime = Date.now();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(metaOrMessage: any, message?: string) {
    let meta;
    if (message) {
      meta = metaOrMessage;
    } else {
      message = metaOrMessage;
      meta = {};
    }

    console.log(
      '%cinfo:',
      'color: blue; background-color: lightgrey',
      message,
      { timestamp: Date.now(), ...meta }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(metaOrMessage: any, message?: string) {
    let meta;
    if (message) {
      meta = metaOrMessage;
    } else {
      message = metaOrMessage;
      meta = {};
    }

    console.error(message, { timestamp: Date.now(), ...meta });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(metaOrMessage: any, message?: string) {
    let meta;
    if (message) {
      meta = metaOrMessage;
    } else {
      message = metaOrMessage;
      meta = {};
    }

    console.warn('warn: ', message, { timestamp: Date.now(), ...meta });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(metaOrMessage: any, message?: string) {
    let meta;
    if (message) {
      meta = metaOrMessage;
    } else {
      message = metaOrMessage;
      meta = {};
    }

    console.debug(
      '%cdebug:',
      'color: orange; background-color: grey',
      message,
      { timestamp: Date.now(), ...meta }
    );
  }

  private lastTraceTime: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(metaOrMessage: any, message?: string) {
    let meta;
    if (message) {
      meta = metaOrMessage;
    } else {
      message = metaOrMessage;
      meta = {};
    }

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
  info(metaOrMessage: any, message?: string) {
    // noop
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  error(metaOrMessage: any, message?: string) {
    // noop
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  warn(metaOrMessage: any, message?: string) {
    // noop
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  debug(metaOrMessage: any, message?: string) {
    // noop
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  trace(metaOrMessage: any, message?: string) {
    // noop
  }
}

export default process.env.NODE_ENV === 'development'
  ? new DevLogger()
  : new ProdLogger();
