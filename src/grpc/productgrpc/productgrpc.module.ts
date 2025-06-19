// app.module.ts or product.module.ts
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
// import { GrpcProductService } from './product.grpc-client';

import { Module } from '@nestjs/common';
import { GrpcProductService } from './product.grpc-client';
@Module ({
  imports:[
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, './product.proto'),
          url: '172.50.5.124:5001',
        },
      },
  ])
  ],
  providers :[GrpcProductService],
  exports: [ClientsModule,GrpcProductService],
})
export class ProductGrpcClientModule {}



