



import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument, AdminSchema } from '../../schema/admin.schema';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { GrpcClientService } from '../../grpc/authgrpc/auth.grpc-client';
import { RedisService } from '../../providers /redis/redis.service';
import {  hashPassword, verifyPassword } from 'src/utils/password-utils'; 
 
import { sendOtp } from '../../providers /email /email.service';
import { generateOtp } from 'src/utils/otp-generator';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenResponse } from '../../interfaces/auth.interface';
import * as winston from 'winston';
import { InjectLogger } from 'src/utils/logger/logger.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {     
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly grpcClientService: GrpcClientService, 
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    @InjectLogger('AdminService') private readonly logger: winston.Logger,
  ) {}

  async signup(signupAdminDto: SignupAdminDto) {
    this.logger.info('Admin signup attempt', { email: signupAdminDto.email });
    
    const { email, password, deviceId } = signupAdminDto;

    try {
      const existingAdminCount = await this.adminModel.countDocuments();
      if (existingAdminCount > 1) {
        this.logger.warn('Admin creation blocked - already exists');
        throw new ConflictException('Admin already exists. Only one admin is allowed.');
      }
      
      const existingAdmin = await this.adminModel.findOne({ email });
      if (existingAdmin) {
        this.logger.warn(`Admin with email ${email} already exists`);
        throw new ConflictException('Admin with this email already exists');
      }
  
      const hashedPassword = await hashPassword(password);
      const newAdmin = new this.adminModel({
        email,
        password: hashedPassword,
        role: 'admin'
      });
      
      const savedAdmin = await newAdmin.save();
      this.logger.info('Admin created successfully', { adminId: savedAdmin._id });

      return {
        admin: {
          entityId: savedAdmin._id,
          email: savedAdmin.email,
          deviceId: deviceId,
          role: 'admin',
        }
      };
    } catch (error) {
      this.logger.error('Error in admin signup', { 
        error: error.message, 
        stack: error.stack 
      });
      throw error;
    }
  }

  async login(loginAdminDto: LoginAdminDto) {
    this.logger.info('Admin login attempt', { email: loginAdminDto.email });
    
    const { email, password ,deviceId} = loginAdminDto;
    
    try {
      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        
        this.logger.warn('Login failed - admin not found', { email });
        throw new UnauthorizedException('Invalid credentials');
      }
   
      const passwordMatch = await verifyPassword(password, admin.password);
      if (!passwordMatch) {
      
        this.logger.warn('Login failed - invalid password', { email });
        throw new UnauthorizedException('Invalid credentials');
      }
    
      const entityId = admin._id.toString();
      const role = 'admin';
      // const deviceId = 'android';


      this.logger.debug('Requesting tokens from gRPC service', { entityId, role });
      
      const tokens = await this.grpcClientService.getToken(entityId, deviceId, role, email);

      this.logger.info('Admin login successful', { email, entityId });

      return {
        admin: {
          email: admin.email,
          deviceId: deviceId,
          role,
          entityId: admin._id.toString()
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      };
    } catch (error) {
      this.logger.error('Login error', { 
        error: error.message, 
        stack: error.stack 
      });
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email } = forgotPasswordDto;
     
      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const otp = generateOtp();
      await this.redisService.setOtp(email, otp);

      await sendOtp(email, otp);

      const resetToken = this.jwtService.sign(
        { email },
        { expiresIn: '15m' } 
      );
     
      return { message: "OTP sent to your email" ,resetToken};
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to process forgot password request');
    }
  }


  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { otp, newPassword } = resetPasswordDto;
      const token =resetPasswordDto.token
    
      let decoded: { email: string };
 
      try {
        decoded = this.jwtService.verify(token);
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const email = decoded.email;

      if (!email) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      const storedOtp = await this.redisService.getOtp(email);
    
      if (!storedOtp) {
        throw new UnauthorizedException('OTP expired or invalid');
      }

      if (storedOtp !== otp) {
        throw new UnauthorizedException('Invalid OTP');
      }

      const hashedPassword = await hashPassword(newPassword);
      const updatedAdmin = await this.adminModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true },
      );

      if (!updatedAdmin) {
        throw new UnauthorizedException('Admin not found');
      }

      await this.redisService.deleteOtp(email);
      return { message: 'Password successfully reset' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async changePassword(admin: AdminDocument, changePasswordDto: ChangePasswordDto) {
    this.logger.info('Change password request', { adminId: admin._id });

    try {
      const { currentPassword, newPassword } = changePasswordDto;
    
      const passwordMatch = await verifyPassword(currentPassword, admin.password);
      if (!passwordMatch) {
        this.logger.warn('Change password failed - current password incorrect', { adminId: admin._id });
        throw new UnauthorizedException('Current password is incorrect');
      }
    
      const hashedPassword = await hashPassword(newPassword);
      admin.password = hashedPassword;
      await admin.save();
      this.logger.info('Password changed successfully', { adminId: admin._id });
    
      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error('Change password failed', {
        adminId: admin._id,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async logout(accessToken: string) {
    this.logger.info('Logout request received');

    try {
      const result = await this.grpcClientService.logout({ accessToken });
      this.logger.info('Logout successful');
      
      return {
        success: result.success,
        message: result.success 
          ? 'Logged out successfully' 
          : 'Logout failed'
      };
    } catch (error) {
      this.logger.error('Logout failed', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    this.logger.info('Refresh token request received');

    try {
      const { refreshToken } = refreshTokenDto;
      const result = await this.grpcClientService.accessToken({ refreshToken });
      this.logger.info('Token refreshed successfully');
      
      return {
        accessToken: result.accessToken
      };
    } catch (error) {
      this.logger.error('Token refresh failed', {
        error: error.message,
        stack: error.stack
      });
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async validateToken(accessToken: string) {
    this.logger.debug('Token validation request received');

    try {
      const result = await this.grpcClientService.validateToken({ accessToken });
      this.logger.debug('Token validation completed', { isValid: result.isValid });
      
      return {
        isValid: result.isValid,
        admin: result.entityId,
      };
    } catch (error) {
      this.logger.error('Token validation failed', {
        error: error.message,
        stack: error.stack
      });
      if (error.name === 'BadRequestException') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate token');
    }
  }
}

