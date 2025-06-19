

import { Controller, Get, HttpStatus, Param, Put, Query, UseGuards, HttpException } from '@nestjs/common';
import { UserAdminGrpcService } from './grpc.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';
import * as winston from 'winston';
import { InjectLogger } from 'src/utils/logger/logger.provider';

@ApiTags('Admin Users') 
@UseGuards(AuthGuard)
@Controller('admin/users')
export class UserController {
 

  constructor(private readonly userAdminService: UserAdminGrpcService,
    @InjectLogger(UserController.name) private readonly logger: winston.Logger
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async getUser(@Param('id') id: string) {

    try {
      const user = await this.userAdminService.getUserById({ userId: id });
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
     
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', description: 'Page number', type: Number, required: false })
  @ApiQuery({ name: 'limit', description: 'Number of users per page', type: Number, required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users retrieved successfully' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
   
    try {
      const users = await this.userAdminService.getAllUsers({ page, limit });
      
      return users;
    } catch (error) {
      this.logger.error(`Error fetching all users: ${error.message}`, error.stack);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search users by query and status' })
  @ApiQuery({ name: 'query', description: 'Search query (e.g., name, email)', type: String, required: true })
  @ApiQuery({ name: 'status', description: 'User status', enum: ['active', 'inactive', 'block'], required: false })
  @ApiQuery({ name: 'limit', description: 'Number of users to return', type: Number, required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users matching the search criteria' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async searchUsers(
    @Query('query') query: string,
    @Query('status') status: 'active' | 'inactive' | 'block',
    @Query('limit') limit: number = 10,
  ) {
    
    try {
      if (!query) {
        this.logger.warn('Search query is required');
        throw new HttpException('Query parameter is required', HttpStatus.BAD_REQUEST);
      }
      const users = await this.userAdminService.searchUsers({ query, status, limit });
    
      return users;
    } catch (error) {
      this.logger.error(`Error searching users: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('block/:id')
  @ApiOperation({ summary: 'Block a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User blocked successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async blockUser(@Param('id') id: string) {
   
    try {
      const result = await this.userAdminService.updateUserStatus({ userId: id });
      if (!result) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    
      return result;
    } catch (error) {
      this.logger.error(`Error blocking user with ID ${id}: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('unblock/:id')
  @ApiOperation({ summary: 'Unblock a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User unblocked successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async unblockUser(@Param('id') id: string) {
   
    try {
      const result = await this.userAdminService.unblockUser({ userId: id });
      if (!result) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error unblocking user with ID ${id}: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}