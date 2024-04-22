import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  logger = new Logger(ExcludeNullInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.warn('===TRIGGER ROUTE INTERCEPTOR (PRE)===');
    return next.handle().pipe(
      map((value) => {
        let str = JSON.stringify(value, (k, v) => (v === null ? '' : v));
        let result = JSON.parse(str);
        return result;
      }),
      tap(() =>
        // NOTICE: ROUTE INTERCEPTOR
        this.logger.warn('===TRIGGER ROUTE INTERCEPTOR (POST)==='),
      ),
    );
  }
}
