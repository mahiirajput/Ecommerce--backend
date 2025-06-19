
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom ,map} from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { CreateProductRequest, Response, UpdateInventoryRequest, ProductFilter, } from '../../interfaces/productinterface';
import { ProductServiceGrpc } from '../../interfaces/productinterface';
import { GrpcClientService } from '../../grpc/authgrpc/auth.grpc-client';
import { CloudinaryService } from 'src/providers /cloudinary/cloudinary.service';
import { InjectLogger } from 'src/utils/logger/logger.provider';


@Injectable()
export class ProductService {
  private productService: ProductServiceGrpc;
  private readonly grpcClientService: GrpcClientService


  constructor(
    @Inject('PRODUCT_PACKAGE') private client: ClientGrpc,
    private readonly cloudinaryService: CloudinaryService,
    // @Inject('AUTH_PACKAGE') private readonly clientAuth: ClientGrpc,
	  @InjectLogger(ProductService.name) private readonly logger: Logger
	) {}


  onModuleInit() {
    this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
  }



  async createProduct(dto: CreateProductDto,file: Express.Multer.File): Promise<Response> {
    try 
    { const imageUrl = await this.cloudinaryService.uploadImage(file);
      const totalStock = dto.variants.reduce((sum, variant) => sum + variant.stock, 0);

      const payload: CreateProductRequest = {
        name: dto.name,
        category: dto.category,
        subCategory: dto.subCategory || undefined,
        gender: dto.gender || undefined,
        brand: dto.brand,
        imageUrl: imageUrl,
        description: dto.description,
        price: dto.price,
        totalStock: totalStock,
        variants: dto.variants.map(variant => ({
          size: variant.size,
          color: variant.color,
          stock: variant.stock
        }))
      };
      // const grpcResponse = await lastValueFrom(this.productService.CreateProduct(payload));

       const grpcResponse = await lastValueFrom(
        this.productService.CreateProduct(payload).pipe(
          map(response => ({
            ...response,
            data: typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data
          }))
        )
      );
      if (!grpcResponse) {
        throw new InternalServerErrorException('Empty response from product service');
      }

      return grpcResponse as Response;
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }


  async updateProduct(id: string, dto: UpdateProductDto): Promise<Response> {
    try {
      const totalStock = dto.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      const payload = { id, ...dto, totalStock };
      // const result = await lastValueFrom(this.productService.UpdateProduct(payload)) as Response;
       const result= await lastValueFrom(
        this.productService.UpdateProduct(payload).pipe(
          map(response => ({
            ...response,
            data: typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data
          }))
        )
      );
      return result;
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to update product');
    }
  }


  async getProduct(id: string): Promise<Response> {
    try {
      // const result = await lastValueFrom(this.productService.GetProduct({ id }));
       const result= await lastValueFrom(
        this.productService.GetProduct({ id }).pipe(
          map(response => ({
            ...response,
            data: typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data
          }))
        )
      );
      if (!result) throw new NotFoundException('Product not found');
      return result;
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to get product');
    }
  }


  async listProducts(filter: ProductFilter): Promise<Response> {
    try {
      // return await lastValueFrom(this.productService.ListProducts(filter));
       return await lastValueFrom(
        this.productService.ListProducts(filter).pipe(
          map(response => ({
            ...response,
            data: typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data
          }))
        )
      );
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to list products');
    }
  }


  async deleteProduct(id: string): Promise<Response> {
    try {
      return await lastValueFrom(
        this.productService.DeleteProduct({ id }).pipe(
          map(response => ({
            ...response,
            data: typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data
          }))
        )
      );
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }



  async updateInventory(request: UpdateInventoryRequest): Promise<Response> {
    try {
      // return await lastValueFrom(this.productService.UpdateInventory(request));
      const result= await lastValueFrom(
        this.productService.UpdateInventory(request).pipe(
          map(response => ({
            ...response,
            data: typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data
          }))
        )
      );
      if (!result) {
        throw new NotFoundException('Inventory not found');
      }
      return result;
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to update inventory');
    }
  }


  async validateToken(accessToken: string) {
    const result = await this.grpcClientService.validateToken({
      accessToken
    });

    return {
      isValid: result.isValid,
      admin: result.entityId,
    };
  }


}