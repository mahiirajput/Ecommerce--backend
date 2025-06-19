import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ProductGrpcClientModule } from 'src/grpc/productgrpc/productgrpc.module';
import { UserAdminGrpcModule } from '../users/grpc.module';
import { DashboardController } from './dashboard.controller';


@Module({
    imports:[ UserAdminGrpcModule, 
    ProductGrpcClientModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}