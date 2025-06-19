import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generateOtp } from '../../utils/otp-generator';
 
 
 export const sendOtp= async  (email: string, generateOtp: string)=> 
  {
  const transporter = nodemailer.createTransport({
  
      host: process.env.SMTP_HOST|| 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT|| '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER||'mahi.rajput@appinventiv.com',
        pass: process.env.SMTP_PASS||'acea sbch ojje ennw',
      },

    });

      
    await transporter.sendMail({
       
      from: process.env.SMTP_USER || 'mahi.rajput@appinventiv.com', 
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${generateOtp}. It is valid for 10 minutes.`,

    });
    
   
  }
 
