import './boilerplate.polyfill';

import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomThrottlerGuard } from 'guards/customThrottler.guard';
import { VersionMiddleware } from 'middlewares/version.middleware';
import { AuthModule } from 'modules/auth/auth.module';
import { CartModule } from 'modules/cart/cart.module';
import { ShopModule } from 'modules/shop/shop.module';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { DiscountModule } from './modules/discount/discount.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ShopModule,
    ProductModule,
    DiscountModule,
    CartModule,
    HealthCheckerModule,
    OrderModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      dataSourceFactory: (options: any) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    CacheModule.registerAsync({
      imports: [SharedModule], // Optionally import ConfigModule if needed
      inject: [ApiConfigService], // Inject ConfigService to access environment variables
      useFactory: async (configService: ApiConfigService) =>
        configService.redisConfig,
    }),
    ClientsModule.registerAsync([
      {
        name: 'rabbitMQ',
        useFactory: (configService: ApiConfigService) =>
          configService.rabbitConfig,
        inject: [ApiConfigService],
      },
    ]),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VersionMiddleware).forRoutes('users');
  }
}
