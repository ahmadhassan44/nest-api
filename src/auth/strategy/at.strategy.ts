import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtfromRequest: Strategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretKey: process.env.JWT_AT_SECRET,
    });
  }
  validate(payload: any) {
    return payload;
  }
}
