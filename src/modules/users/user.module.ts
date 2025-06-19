import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserAdminGrpcModule } from './grpc.module';
import { AdminModule } from 'src/modules/admin-auth/admin.module';
import { UserAdminGrpcService } from 'src/modules/users/grpc.service';
import { LoggerModule } from 'src/utils/logger/logger.module';


@Module({
  imports: [UserAdminGrpcModule,AdminModule,
      LoggerModule.forFeature('UserAdminGrpcService'),
        LoggerModule.forFeature('UserController'),
  ],
  controllers: [UserController],
  providers: [UserAdminGrpcModule],
})
export class UserModule {}

