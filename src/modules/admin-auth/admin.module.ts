import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schema/admin.schema';
// import { AuthGuard, PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../utils/jwt.strategy';
import { RedisModule } from '../../providers /redis/redis.module';
import config from '../../config/jwt.config';
import { AuthGrpcClientModule } from '../../grpc/authgrpc/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoggerModule } from 'src/utils/logger/logger.module';
// import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
  JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', 
      signOptions: { expiresIn: '15m' },
    }),
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ 
      name: Admin.name, 
      schema: AdminSchema 
    }]),
    AuthGrpcClientModule,
    RedisModule,
    LoggerModule.forFeature('AdminService'),
    LoggerModule.forFeature('AdminController'),

  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtStrategy 
  ],
  exports: [AdminService]
})
export class AdminModule {}