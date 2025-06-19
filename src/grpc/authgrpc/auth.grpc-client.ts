
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { join } from 'path';
import { Tokens } from '../../interfaces/token.inteface';
import { AccessTokenRequest, AccessTokenResponse, ValidateTokenRequest, ValidateTokenResponse, LogoutRequest, LogoutResponse, AuthService } from '../../interfaces/auth.interface';


@Injectable()
export class GrpcClientService implements OnModuleInit{

  private authService: AuthService;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService'); 
  }

  async getToken(entityId: string, deviceId: string, role: string, email: string): Promise<Tokens> {
    return new Promise((resolve, reject) => {
      this.authService.getToken({ entityId, deviceId, role, email }).subscribe({
        next: (response:any) => resolve(response),
        error: (err) => reject(err),
      });
    });
  }


  async accessToken(request: AccessTokenRequest): Promise<AccessTokenResponse> {
    return new Promise((resolve, reject) => {
      this.authService.accessToken(request).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    return new Promise((resolve, reject) => {
      this.authService.logout(request).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  async validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    return new Promise((resolve, reject) => {
      this.authService.validateToken(request).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }
}
