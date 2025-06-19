import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';



export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      // cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      // api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      // api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      cloud_name:'ntlveoq0',
api_key:	'671939583929332',
api_secret :'pX-x6ngVNGTvY7qLMimbWwXxip4'
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
        resource_type: 'image',
      });
      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}