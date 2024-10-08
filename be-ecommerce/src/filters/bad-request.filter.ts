import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
  Catch,
  HttpException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name);

  constructor(public reflector: Reflector) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const r = exception.getResponse() as { message: ValidationError[] };

    this.logger.debug('===TRIGGER GLOBAL FILTER===');
    console.log('bad request exception');

    response.status(statusCode).json({
      ...r,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack: exception.stack,
    });
  }
}
