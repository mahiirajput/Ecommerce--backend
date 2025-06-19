
import * as winston from 'winston';

export const getWinstonConfig = (context: string) => ({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: context }),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, label }) => {
      return `[${timestamp}] [${label}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});