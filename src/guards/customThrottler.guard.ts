import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  logger = new Logger(CustomThrottlerGuard.name);
  canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('===TRIGGER GLOBAL GUARD===');
    return super.canActivate(context);
  }
}
