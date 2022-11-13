import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.getTokenFromHeader(req);
    if (token) {
      const decoded: any = jwt.verify(token, SECRET);

      const user = await this.userRepository.findOneBy({ id: decoded.id });
      if (!user) {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }

      req['auth'] = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  };

  getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }

    return null;
  }
}