import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { IAuthGuard, AuthGuard as NestAuthGuard, Type } from '@nestjs/passport';
import { AuthService } from 'modules/auth/auth.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   logger = new Logger(AuthGuard.name);
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     // NOTICE: CONTROLLER GUARD
//     this.logger.log('===TRIGGER CONTROLLER GUARD===');
//     // IMPLEMENT JWT GUARD LOGIC HERE
//     return true;
//   }
// }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;

      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/Bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);

      //   const resp = await this.authService.validateToken(authToken);
      //   request.decodedData = resp;
      return true;
    } catch (error: any) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In',
      );
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  logger = new Logger(AdminGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // NOTICE: ROUTE GUARD
    this.logger.log('===TRIGGER ROUTE GUARD===');
    // IMPLEMENT QUERY FLASH-CARD DATA AND CHECK OWNERSHIP
    return true;
  }
}
