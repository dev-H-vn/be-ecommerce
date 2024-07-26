import { STATUS_CODES } from 'node:http';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { constraintErrors } from './constraint-errors';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  constructor(public reflector: Reflector) {}

  catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.constraint?.startsWith('UQ')
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log('error_hihihahakeke', exception.message, exception.constraint);
    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: exception.constraint
        ? constraintErrors[exception.constraint]
        : exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack: exception.stack,
    });
  }
}
