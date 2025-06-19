import { Module, DynamicModule } from '@nestjs/common';
import * as winston from 'winston';
import { getWinstonConfig } from '../../config/logger.config';

@Module({})
export class LoggerModule {

  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER',
          useFactory: (context: string) => {
            return winston.createLogger(getWinstonConfig(context));
          },
          inject: [],
        },
      ],
      exports: ['LOGGER'],
    };
  }
static forFeature(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: `LOGGER_${context}`,
          useFactory: () => {
            return winston.createLogger(getWinstonConfig(context));
          },
        },
      ],
      exports: [`LOGGER_${context}`],
    };
  }
}