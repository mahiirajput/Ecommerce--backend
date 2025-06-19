
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { ProductFilterDto } from './dto/product.filter.dto';
import { InventoryUpdateAdminDto } from './dto/inventoryupdate.dto';
import { Roles } from '../../rbac/decorators/roles.decorators';
import { Permissions } from '../../rbac/decorators/permissions.decorators';
import { RolesGuard } from '../../rbac/guards/roles.guards';
import { PermissionsGuard } from '../../rbac/guards/permissions.guard';
import { AdminRoles } from '../../rbac/enums/admin-roles.enum';
import { permissions } from '../../rbac/enums/permissions';
import { AuthGuard } from '../../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateInventoryRequest } from 'src/interfaces/productinterface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as winston from 'winston';
import { InjectLogger } from 'src/utils/logger/logger.provider';

@ApiTags('Admin Products')
@Controller('admin/products')
@UseGuards(AuthGuard)
@UseGuards(RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectLogger('ProductController') private readonly logger: winston.Logger,
  ) {}

  @Post('create')
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_CREATE)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product with details and an optional image file.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data and image file',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'T-Shirt', description: 'Name of the product' },
        category: { type: 'string', example: 'Clothing', description: 'Product category' },
        subCategory: { type: 'string', example: 'Casual', nullable: true, description: 'Product subcategory' },
        gender: { type: 'string', example: 'Unisex', nullable: true, description: 'Target gender' },
        brand: { type: 'string', example: 'Nike', description: 'Brand of the product' },
        imageUrl: { type: 'string', example: 'http://example.com/image.jpg', nullable: true, description: 'Product image URL' },
        description: { type: 'string', example: 'Comfortable cotton t-shirt', description: 'Product description' },
        price: { type: 'number', example: 29.99, description: 'Price of the product' },
        totalStock: { type: 'number', example: 100, description: 'Total stock for the product' },
        variants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { type: 'string', example: 'M', description: 'Size of the variant' },
              color: { type: 'string', example: 'Blue', description: 'Color of the variant' },
              stock: { type: 'number', example: 50, description: 'Stock quantity for the variant' },
            },
            required: ['size', 'color', 'stock'],
          },
        },
        image: { type: 'string', format: 'binary', description: 'Product image file' },
      },
      required: ['name', 'category', 'brand', 'description', 'price', 'totalStock', 'variants'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    schema: {
      example: {
        success: true,
        message: 'Product created successfully',
        data: { productId: '12345', name: 'T-Shirt', price: 29.99 },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Product with this name already exists' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async create(@Body() dto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    this.logger.info('Received product creation request', { name: dto.name, file: file?.originalname });
    try {
      const result = await this.productService.createProduct(dto, file);
      this.logger.info('Product created successfully');
      return {
        success: true,
        message: 'Product created successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to create product', { error: error.message, name: dto.name });
      throw error;
    }
  }

  @Patch(':id')
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_UPDATE)
  @ApiOperation({
    summary: 'Update an existing product',
    description: 'Updates product details for the specified product ID.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String, example: '12345' })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product update data',
    schema: {
      example: {
        name: 'Updated T-Shirt',
        price: 34.99,
        description: 'Updated comfortable cotton t-shirt',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Product updated successfully',
        data: { productId: '12345', name: 'Updated T-Shirt', price: 34.99 },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Product update conflicts with existing data' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    this.logger.info('Received product update request', { id, name: dto.name });
    try {
      const result = await this.productService.updateProduct(id, dto);
      this.logger.info('Product updated successfully', { id });
      return {
        success: true,
        message: 'Product updated successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to update product', { id, error: error.message });
      throw error;
    }
  }

  @Get(':id')
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_READ)
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Retrieves details of a product by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String, example: '12345' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Product retrieved successfully',
        data: {
          productId: '12345',
          name: 'T-Shirt',
          variants: [{ size: 'M', color: 'Blue', stock: 50 }],
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    this.logger.info('Received product fetch request', { id });
    try {
      const result = await this.productService.getProduct(id);
      this.logger.info('Product retrieved successfully', { id });
      return {
        success: true,
        message: 'Product retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to fetch product', { id, error: error.message });
      throw error;
    }
  }

  @Get()
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_READ)
  @ApiOperation({
    summary: 'List products with filters',
    description: 'Retrieves a list of products with optional filters for pagination, category, and brand.',
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', type: Number, required: false, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'categoryName', type: String, required: false, example: 'Clothing', description: 'Filter by category name' })
  @ApiQuery({ name: 'brand', type: String, required: false, example: 'Nike', description: 'Filter by brand' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Products retrieved successfully',
        data: [
          { productId: '12345', name: 'T-Shirt', price: 29.99 },
          { productId: '67890', name: 'Jeans', price: 59.99 },
        ],
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async findAll(@Query() filter: ProductFilterDto) {
    this.logger.info('Received product list request', { filter });
    try {
      const result = await this.productService.listProducts(filter);
      this.logger.info('Products listed successfully');
      return {
        success: true,
        message: 'Products retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to list products', { error: error.message });
      throw error;
    }
  }

  @Delete(':id')
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_DELETE)
  @ApiOperation({
    summary: 'Delete a product by ID',
    description: 'Deletes a product by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String, example: '12345' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Product deleted successfully',
        data: { productId: '12345' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    this.logger.info('Received product deletion request', { id });
    try {
      const result = await this.productService.deleteProduct(id);
      this.logger.info('Product deleted successfully', { id });
      return {
        success: true,
        message: 'Product deleted successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to delete product', { id, error: error.message });
      throw error;
    }
  }

  @Put('inventory/:id')
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.INVENTORY_UPDATE)
  @ApiOperation({
    summary: 'Update product inventory',
    description: 'Updates the inventory for a product’s variants by ID.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String, example: '12345' })
  @ApiBody({
    type: InventoryUpdateAdminDto,
    description: 'Inventory update data',
    schema: {
      example: {
        productId: '12345',
        variants: [
          { variantId: 'var1', stock: 100, size: 'M', color: 'Blue' },
          { variantId: 'var2', stock: 50, size: 'L', color: 'Red' },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Inventory updated successfully',
        data: { productId: '12345', updatedVariants: 2 },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product or variant not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Inventory update conflicts with existing data' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async updateInventory(@Param('id') id: string, @Body() request: InventoryUpdateAdminDto) {
    this.logger.info('Received inventory update request', { productId: request.productId });
    try {
      const updateInventoryRequest: UpdateInventoryRequest = {
        productId: request.productId,
        variants: request.variants.map((variant) => ({
          stock: variant.stock,
          size: variant.size ?? '',
          color: variant.color ?? '',
        })),
      };
      const result = await this.productService.updateInventory(updateInventoryRequest);
      this.logger.info('Inventory updated successfully', { productId: request.productId });
      return {
        success: true,
        message: 'Inventory updated successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to update inventory', { productId: request.productId, error: error.message });
      throw error;
    }
  }
}
  