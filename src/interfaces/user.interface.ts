export interface IUserAdminGrpcService {
  getAllUsers(request: GetAllUsersRequest): Promise<GetAllUsersResponse>;
  getUserById(request: GetUserByIdRequest): Promise<GetUserByIdResponse>;
  updateUserStatus(request: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse>;
  unblockUser(request: UnblockUserRequest): Promise<UnblockUserResponse>;
  searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse>;
}

export interface GetAllUsersRequest {
  page: number;
  limit: number;
}

export interface GetAllUsersResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
  message: string;
}

export interface GetUserByIdRequest {
  userId: string;
}

export interface GetUserByIdResponse {
  user: UserData;
  success: boolean;
  message: string;
}

export interface UpdateUserStatusRequest {
  userId: string;
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
}

export interface UnblockUserRequest {
  userId: string;
}

export interface UnblockUserResponse {
  success: boolean;
  message: string;
}

export interface SearchUsersRequest {
  query: string;
  status: string;
  limit: number;
}

export interface SearchUsersResponse {
  users: UserData[];
  total: number;
  success: boolean;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: string;
  role: string;
}