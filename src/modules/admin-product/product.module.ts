import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductGrpcClientModule } from '../../grpc/productgrpc/productgrpc.module'
import { AuthGrpcClientModule } from 'src/grpc/authgrpc/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminModule } from '../admin-auth/admin.module';
import { CloudinaryModule } from 'src/providers /cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { LoggerModule } from 'src/utils/logger/logger.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    CloudinaryModule,
  ProductGrpcClientModule,AuthGrpcClientModule,AdminModule,
  LoggerModule.forFeature('ProductService'),
      LoggerModule.forFeature('ProductController'),
  ],

  
  controllers: [ProductController],
  providers: [
    ProductService,ProductGrpcClientModule
  
  ],
})
export class ProductModule {}
