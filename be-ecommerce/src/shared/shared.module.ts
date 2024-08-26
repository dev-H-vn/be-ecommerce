import { CacheModule } from '@nestjs/cache-manager';
import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisService } from 'shared/services/redis.service';

import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';
import { RmqService } from 'shared/services/rabbitmq.service';
import { ClientsModule } from '@nestjs/microservices';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  AwsS3Service,
  GeneratorService,
  RedisService,
  RmqService,
];

@Global()
@Module({
  providers,
  imports: [
    CqrsModule,
    CacheModule.registerAsync({
      inject: [ApiConfigService], // Inject ConfigService to access environment variables
      useFactory: async (configService: ApiConfigService) =>
        configService.redisConfig,
    }),
    ClientsModule.registerAsync([
      {
        name: 'RABBIT_MQ',
        inject: [ApiConfigService],
        useFactory: (configService: ApiConfigService) =>
          configService.rabbitConfig,
      },
    ]),
  ],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
