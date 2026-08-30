/**
 * Lightweight structured telemetry logger.
 * Formats events as structured JSON objects for console in dev and future log sinks.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogPayload {
  event: string;
  [key: string]: unknown;
}

class TelemetryLogger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, payload: LogPayload) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      ...payload,
    };

    if (this.isDevelopment) {
      const style = level === 'ERROR' ? 'color: #ef4444; font-weight: bold;'
        : level === 'WARN' ? 'color: #f59e0b;'
        : level === 'INFO' ? 'color: #3b82f6;'
        : 'color: #94a3b8;';
      console.log(`%c[${level}] ${payload.event}`, style, entry);
    } else {
      // In production: send to Sentry / Datadog sink
      console.log(JSON.stringify(entry));
    }
  }

  debug(event: string, meta?: Record<string, unknown>) {
    this.log('DEBUG', { event, ...meta });
  }

  info(event: string, meta?: Record<string, unknown>) {
    this.log('INFO', { event, ...meta });
  }

  warn(event: string, meta?: Record<string, unknown>) {
    this.log('WARN', { event, ...meta });
  }

  error(event: string, meta?: Record<string, unknown>) {
    this.log('ERROR', { event, ...meta });
  }
}

export const logger = new TelemetryLogger();
