// src/grpc/product/product-grpc.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ProductServiceGrpc,
  CreateProductRequest,
  UpdateProductRequest,
  ProductID,
  ProductFilter,
  UpdateInventoryRequest,
  Response
} from '../../interfaces/productinterface';

@Injectable()
export class GrpcProductService implements OnModuleInit {
  private productService: ProductServiceGrpc;

  constructor(
    @Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
  }

}
