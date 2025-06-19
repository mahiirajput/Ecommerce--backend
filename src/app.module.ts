
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from'./modules/admin-auth/admin.module';
import { RedisService } from './providers /redis/redis.service'; 
 import { AuthGrpcClientModule } from './grpc/authgrpc/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/admin-product/product.module';
import { ProductGrpcClientModule } from './grpc/productgrpc/productgrpc.module';
import { UserModule } from './modules/users/user.module';
import { getWinstonConfig } from './config/logger.config';
import { WinstonModule } from 'nest-winston';
import { CloudinaryModule } from './providers /cloudinary/cloudinary.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    CloudinaryModule,
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AdminModule , ProductModule,UserModule,
    WinstonModule.forRoot(getWinstonConfig('App')),
  ],



})
export class AppModule {}
