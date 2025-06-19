import { Injectable } from '@nestjs/common';
import { GrpcProductService } from 'src/grpc/productgrpc/product.grpc-client';
import { UserAdminGrpcService } from '../users/grpc.service';
import { DashboardStats } from 'src/interfaces/dashboard.interface';
import { ProductService } from '../admin-product/product.service';


@Injectable()
export class DashboardService {
  constructor(
    private readonly userGrpcService: UserAdminGrpcService,

	private readonly productService: ProductService
  ) { }

  async getDashboardStats(): Promise<DashboardStats> {
    const usersResponse = await this.userGrpcService.getAllUsers({
      page: 1,
      limit: 1,

    });

    const productResponse= await this.productService.listProducts({})
    const parsedData = JSON.parse(productResponse.data);
    
    return {
      totalOrders: 300,
      totalProducts: parsedData.total,
      totalUsers: usersResponse.total,
      totalRevenue: '504694',
    };
  }
}