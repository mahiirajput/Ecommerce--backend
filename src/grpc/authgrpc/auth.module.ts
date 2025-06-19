
import { Module } from '@nestjs/common';
import { GrpcClientService } from './auth.grpc-client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, 'auth.proto'),
          url: '172.50.3.60:5052',
        },
      },
    ]),
  ],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class AuthGrpcClientModule {}
