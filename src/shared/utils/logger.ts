/**
 * Log levels for structured logging
 */
export enum LogLevel {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  DEBUG = "debug",
}

/**
 * Structured log entry
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Logger service for structured error handling and monitoring
 */
class LoggerService {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Creates a structured log entry
   */
  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }

    return entry;
  }

  /**
   * Logs a message to console (development) or remote service (production)
   */
  private log(entry: LogEntry): void {
    if (this.isDevelopment) {
      // In development, log to console
      let logMethod = console.log;
      if (entry.level === LogLevel.ERROR) {
        logMethod = console.error;
      } else if (entry.level === LogLevel.WARNING) {
        logMethod = console.warn;
      }

      logMethod(`[${entry.level.toUpperCase()}] ${entry.message}`, {
        timestamp: entry.timestamp,
        ...entry.context,
        ...(entry.error && { error: entry.error }),
      });
    } else {
      // In production, send to remote monitoring service
      // Future: Integrate with monitoring service (e.g., Sentry, LogRocket, DataDog)
      // Example: sentryService.captureException(entry);
      console.error("Production log:", entry);
    }
  }

  /**
   * Logs an informational message
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.log(entry);
  }

  /**
   * Logs a warning message
   */
  warning(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARNING, message, context);
    this.log(entry);
  }

  /**
   * Logs an error with optional context
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.log(entry);
  }

  /**
   * Logs a debug message (only in development)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
      this.log(entry);
    }
  }
}

export const logger = new LoggerService();
