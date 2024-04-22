/*
https://docs.nestjs.com/middleware#middleware
*/

import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class VersionMiddleware implements NestMiddleware {
  logger = new Logger(VersionMiddleware.name);
  use(req: Request, res: Response, next: Function) {
    this.logger.debug('===TRIGGER MODULE BOUND MIDDLEWARE===');
    // const appVersion = req.headers['x-app-version'];
    // if (!appVersion && appVersion !== '2.0.0') {
    //   throw new BadRequestException('Invalid bad version!');
    // }
    next();
  }
}
