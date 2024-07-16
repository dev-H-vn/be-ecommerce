import type { PipeTransform } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  Injectable,
  Logger,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ArgumentMetadata, type Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { type RoleType } from '../constant';
import { AdminGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';
import { isObjectIdOrHexString } from 'mongoose';
import { isUUID } from 'class-validator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(roles),
    UseGuards(AdminGuard, RolesGuard),
    ApiBearerAuth('bearer'),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  // below is way to use Route Parameter Pipes
  return Param(
    property,
    new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => ({
        message: `Validation failed ${property} must be uuid`,
        statusCode: 400,
      }),
    }),
    ...pipes,
  );
}

@Injectable()
export class ParseTypeParamsPipe implements PipeTransform {
  logger = new Logger(ParseTypeParamsPipe.name);
  type: string;
  constructor(type: string) {
    {
      this.type = type;
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('===TRIGGER ROUTE PARAMS PIPE===');

    switch (this.type) {
      case 'ObjectId':
        if (!isObjectIdOrHexString(value)) {
          throw new BadRequestException('Invalid ID.');
        }
        break;
      case 'string':
        if (typeof value !== 'string') {
          throw new BadRequestException('Value must is string.');
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          throw new BadRequestException('Value must is number.');
        }
        break;
      case 'uuid':
        if (!isUUID(value))
          throw new BadRequestException('Value must is uuid.');
        break;
      default:
        return value;
    }
    return value;
  }
}

@Injectable()
export class ParseCustomControllerPipe implements PipeTransform {
  logger = new Logger(ParseCustomControllerPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.verbose('===TRIGGER CONTROLLER PIPE===');

    return value;
  }
}

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  logger = new Logger(CustomValidationPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug('===TRIGGER GLOBAL PIPE===');

    return value;
  }
}
