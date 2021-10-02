import {
  Injectable,
  NestMiddleware,
  Request,
  Response,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { authorization } = req.headers;
    if (!authorization) {
      throw new HttpException(
        {
          message: 'Missing header',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    next();
  }
}
