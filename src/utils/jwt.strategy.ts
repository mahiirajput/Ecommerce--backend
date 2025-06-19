

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt-logout') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     
      secretOrKey: config().jwtSecret,
      ignoreExpiration: false, 
    });
  }

  async validate(payload: any) {
  
    return payload;
  }
}
