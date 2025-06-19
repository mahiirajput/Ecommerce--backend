

import { Injectable, OnModuleInit ,OnModuleDestroy,Logger} from '@nestjs/common';
import {createClient , RedisClientType} from 'redis';
import { ConfigService } from '@nestjs/config'
import * as redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit , OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.client = createClient({
        url: `redis://${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}`
      });

      this.client.on('error', (err) => {
        this.logger.error(`Redis connection error: ${err.message}`);
      });

      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error.stack);
      throw error;
    }
  }
 

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }
  async setOtp(email: string, otp: string): Promise<boolean> 
  {

    try {
      const ttl = parseInt(this.configService.get('REDIS_TTL') || '600');
      await this.client.set(email, otp, {
        EX: ttl,
      });
      return true;
    }
     catch (error) 
    {
      this.logger.error(`Error setting OTP for ${email}`, error.stack);
      return false;
    }
  
  }

  async getOtp(email: string): Promise<string | null> 
  {
    try {
      return await this.client.get(email);
    }

    catch(error)
    {
      this.logger.error(`Error getting OTP for ${email}`, error.stack);
      return null; 
      
    }
  }

  async deleteOtp(email: string): Promise<boolean> {
    try {
      await this.client.del(email);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting OTP for ${email}`, error.stack);
      return false;
    }
    // await this.client.del(email);
  }
}
