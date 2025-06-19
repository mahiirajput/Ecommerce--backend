import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { from, lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllUsersRequest, GetAllUsersResponse, GetUserByIdRequest, GetUserByIdResponse, UpdateUserStatusRequest, UpdateUserStatusResponse, SearchUsersRequest, SearchUsersResponse, IUserAdminGrpcService, UnblockUserResponse, UnblockUserRequest } from 'src/interfaces/user.interface';


interface UserAdminGrpcClient {
  getAllUsers(request: GetAllUsersRequest): Promise<GetAllUsersResponse>;
  getUserById(request: GetUserByIdRequest): Promise<GetUserByIdResponse>;
  updateUserStatus(request: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse>;
  unblockUser(request: UnblockUserRequest): Promise<UnblockUserResponse>;
  searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse>;
}

@Injectable()
export class UserAdminGrpcService implements OnModuleInit, IUserAdminGrpcService {
  private userAdminGrpcClient: UserAdminGrpcClient;

  constructor(@Inject('USER_ADMIN_GRPC_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userAdminGrpcClient = this.client.getService<UserAdminGrpcClient>('UserAdminGrpcService');
  }


  async getAllUsers(data: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    try {
      return await lastValueFrom(
        from(this.userAdminGrpcClient.getAllUsers(data)).pipe(map(response => response))
      );
    } 
   catch {
      throw new InternalServerErrorException('Unable to fetch all users');
    }
  }


  async getUserById(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    try {
      return await lastValueFrom(
        from(this.userAdminGrpcClient.getUserById(data)).pipe(map(response => response))
      );
    } 
    catch {
      throw new InternalServerErrorException('Unable to fetch user by ID');
    }
  }



  async updateUserStatus(data: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse> {
    try {
      return await lastValueFrom(
        from(this.userAdminGrpcClient.updateUserStatus(data)).pipe(map(response => response))
      );
    } 
   catch {
      throw new InternalServerErrorException('Unable to update user status');
    }
  }

  async searchUsers(data: SearchUsersRequest): Promise<SearchUsersResponse> {
    try {
      return await lastValueFrom(
        from(this.userAdminGrpcClient.searchUsers(data)).pipe(map(response => response))
      );
    } 
    catch {
      throw new InternalServerErrorException('Unable to search users');
    }
  }


  async unblockUser(data: UnblockUserRequest): Promise<UnblockUserResponse> {
    try {
      return await lastValueFrom(
      from(this.userAdminGrpcClient.unblockUser(data)).pipe(
        map(response => response)
      )
    );
    } 
    catch {
      throw new InternalServerErrorException('Unable to unblock user');
    }
  }
}
