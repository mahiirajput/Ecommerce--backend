// import { Inject, Provider } from '@nestjs/common';
// import * as winston from 'winston';
// import { getWinstonConfig } from '../../config/logger.config';

// export function createLoggerProvider(context: string): Provider {
//   return {
//     provide: `LOGGER_${context}`,
//     useFactory: () => {
//       return winston.createLogger(getWinstonConfig(context));
//     },
//   };
// }

// export const InjectLogger = (context: string) => Inject(`LOGGER_${context}`);
// logger.provider.ts
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';

export function InjectLogger(context: string) {
  return Inject(`LOGGER_${context}`);
}