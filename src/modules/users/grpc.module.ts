import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
//import { useradmin } from '../user.proto';
import { UserAdminGrpcService } from './grpc.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_ADMIN_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '172.50.3.140:5051',
          package: 'useradmin',
          protoPath: join(__dirname, './user.proto'),
        },
      },
    ]),
  ],
  providers: [UserAdminGrpcService],
  exports: [UserAdminGrpcService],
})
export class UserAdminGrpcModule {}