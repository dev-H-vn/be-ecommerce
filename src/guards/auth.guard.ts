import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
// import {
//   AuthGuard as NestAuthGuard,
//   type IAuthGuard,
//   type Type,
// } from '@nestjs/passport';
import { Observable } from 'rxjs';

// export function AuthGuard(
//   options?: Partial<{ public: boolean }>,
// ): Type<IAuthGuard> {
//   const strategies = ['jwt'];

//   if (options?.public) {
//     strategies.push('public');
//   }

//   return NestAuthGuard(strategies);
// }

@Injectable()
export class AuthGuard implements CanActivate {
  logger = new Logger(AuthGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // NOTICE: CONTROLLER GUARD
    this.logger.log('===TRIGGER CONTROLLER GUARD===');
    // IMPLEMENT JWT GUARD LOGIC HERE
    return true;
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
