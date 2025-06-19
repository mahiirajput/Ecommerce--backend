

import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus, 
  Headers,
  InternalServerErrorException, 
  UnauthorizedException 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { 
  ApiAcceptedResponse, 
  ApiBearerAuth, 
  ApiBody, 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { LoginResponses } from '../../interfaces/auth.interface';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { AdminDocument } from '../../schema/admin.schema';
import { CurrentUser } from 'src/decorator/current-admin.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { LoggerModule } from '../../utils/logger/logger.module';
import * as winston from 'winston';
import { InjectLogger } from 'src/utils/logger/logger.provider';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @InjectLogger('AdminController') private readonly logger: winston.Logger
  ) {}

  @Post('signup')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ 
  summary: 'Register a new admin',
  description: 'Creates a new admin account with the provided details.'
})
@ApiBody({ 
  type: SignupAdminDto,
  description: 'Admin signup data including email, password, and device ID.',
  examples: {
    example1: {
      summary: 'Admin Signup Example',
      value: {
        email: 'admin@example.com',
        password: 'password123',
        deviceId: 'device-12345'
      }
    }
  }
})
@ApiResponse({
  status: HttpStatus.CREATED,
  description: 'Admin registered successfully.',
  schema: {
    example: {
      success: true,
      message: 'Admin registered successfully',
      data: {
        id: '12345',
        email: 'admin@example.com',
        createdAt: '2025-06-13T15:24:00.000Z'
      }
    }
  }
})
@ApiResponse({ 
  status: HttpStatus.CONFLICT, 
  description: 'Admin already exists or email is taken.',
  schema: {
    example: {
      statusCode: 409,
      message: 'Admin with this email already exists',
      error: 'Conflict'
    }
  }
})
  async signup(@Body() signupAdminDto: SignupAdminDto) {
    this.logger.info('Received admin signup request');
    
    try {
      const result = await this.adminService.signup(signupAdminDto);
      this.logger.info('Admin signup completed successfully');
      
      return {
        success: true,
        message: 'Admin registered successfully',
        data: result
      };
    } catch (error) {
      this.logger.error('Admin signup failed', {
        error: error.message,
        stack: error.stack,
        payload: { email: signupAdminDto.email }
      });
      throw error;
    }
  }

 @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Admin login',
    description: 'Authenticates an admin user and returns access and refresh tokens.'
  })
  @ApiBody({ 
    type: LoginAdminDto,
    description: 'Admin login credentials including email and password.',
    schema: {
      example: {
        email: 'admin@example.com',
        password: 'securePassword123',
        deviceId: 'device-12345'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged in successfully.',
    type: LoginResponses,
    schema: {
      example: {
        success: true,
        message: 'Admin logged in successfully',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          admin: {
            id: '12345',
            email: 'admin@example.com',
            role: 'admin'
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials provided.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized'
      }
    }
  })
  async login(@Body() loginAdminDto: LoginAdminDto): Promise<LoginResponses> {
    this.logger.info('Received admin login request', { email: loginAdminDto.email });
    
    try {
      const result = await this.adminService.login(loginAdminDto);
      this.logger.info('Admin login successful', { email: loginAdminDto.email });
      return result;
    } catch (error) {
      this.logger.error('Admin login failed', {
        error: error.message,
        email: loginAdminDto.email
      });
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change admin password',
    description: 'Allows an authenticated admin to change their password.'
  })
  @ApiBody({ 
    type: ChangePasswordDto,
    description: 'Current and new password for the admin account.',
    schema: {
      example: {
        currentPassword: 'oldPassword123',
        newPassword: 'newSecurePassword456'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully.',
    schema: {
      example: {
        success: true,
        message: 'Password changed successfully',
        data: null
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid credentials or not logged in.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Current password is incorrect',
        error: 'Unauthorized'
      }
    }
  })
  async changePassword(
    @CurrentUser() admin: AdminDocument,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    this.logger.info('Change password request', { adminId: admin._id });
    
    try {
      const result = await this.adminService.changePassword(admin, changePasswordDto);
      this.logger.info('Password changed successfully', { adminId: admin._id });
      
      return {
        success: true,
        message: result.message,
        data: result
      };
    } catch (error) {
      this.logger.error('Failed to change password', {
        adminId: admin._id,
        error: error.message
      });
      throw error;
    }
  }

  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Request password reset',
    description: 'Sends a one-time password (OTP) to the admin’s email for password reset.'
  })
  @ApiBody({ 
    type: ForgotPasswordDto,
    description: 'Email address to receive the password reset OTP.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If the email exists, an OTP has been sent.',
    schema: {
      example: {
        success: true,
        message: 'If this email exists, OTP has been sent'
      }
    }
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.info('Forgot password request', { email: forgotPasswordDto.email });
    
    try {
      const result = await this.adminService.forgotPassword(forgotPasswordDto);
      this.logger.info('Forgot password processed successfully', { email: forgotPasswordDto.email });
      return result;
    } catch (error) {
      this.logger.error('Forgot password failed', {
        email: forgotPasswordDto.email,
        error: error.message
      });
      throw error;
    }
  }

  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset admin password',
    description: 'Verifies the OTP and sets a new password for the admin account.'
  })
  @ApiBody({ 
    type: ResetPasswordDto,
    description: 'OTP and new password for resetting the admin account password.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful.',
    schema: {
      example: {
        success: true,
        message: 'Password successfully reset'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or expired OTP.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid OTP or expired',
        error: 'Unauthorized'
      }
    }
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.logger.info('Reset password request');
    
    try {
      const result = await this.adminService.resetPassword(resetPasswordDto);
      this.logger.info('Password reset successful');
      return result;
    } catch (error) {
      this.logger.error('Password reset failed', {
        error: error.message
      });
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Log out admin',
    description: 'Invalidates the current session for the specified device by revoking the access token.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful logout.',
    schema: {
      example: {
        success: true,
        message: 'Logged out successfully'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid token or missing authorization header.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid token payload: missing required fields',
        error: 'Unauthorized'
      }
    }
  })
  async logout(@Headers('authorization') authHeader: string) {
    this.logger.info('Received logout request');
    
    try {
      if (!authHeader) {
        this.logger.warn('Logout attempt without authorization header');
        throw new UnauthorizedException('Authorization header is required');
      }

      const token = authHeader?.split(' ')[1];
      if (!token) {
        this.logger.warn('Invalid Bearer token format');
        throw new UnauthorizedException('Invalid Bearer token format');
      }

      this.logger.debug('Processing logout', { token: '***' });
      const result = await this.adminService.logout(token);
      this.logger.info('Logout successful');
      
      return result;
    } catch (error) {
      this.logger.error('Logout failed', { error: error.message });
      throw error;
    }
  }

  @Post('refresh-token')
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Generates a new access token using a valid refresh token.'
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token to obtain a new access token.',
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'The refresh token used to obtain a new access token.',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      required: ['refreshToken']
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully.',
    schema: {
      example: {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to refresh token.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to refresh token',
        error: 'Internal Server Error'
      }
    }
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.info('Refresh token request received');
    
    try {
      const result = await this.adminService.refreshToken(refreshTokenDto);
      this.logger.info('Token refreshed successfully');
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: result
      };
    } catch (error) {
      this.logger.error('Failed to refresh token', {
        error: error.message,
        stack: error.stack
      });
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }
}