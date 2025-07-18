

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: any;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private addLog(level: LogLevel, message: string, context?: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data,
    };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.outputToConsole(logEntry);
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const message = `${timestamp} ${context} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(message, entry.data);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(message, entry.data);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(message, entry.data);
        break;
      case LogLevel.ERROR:
        // eslint-disable-next-line no-console
        console.error(message, entry.data);
        break;
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.ERROR, message, context, data);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}