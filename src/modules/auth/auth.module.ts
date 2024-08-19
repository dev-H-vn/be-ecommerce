import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyEntity } from 'modules/auth/key.entity';
import { CheckTokenHandler } from 'modules/auth/queries/check-token-used';
import { ShopModule } from 'modules/shop/shop.module';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';

const handlers = [CheckTokenHandler];
@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ShopModule),
    TypeOrmModule.forFeature([KeyEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          //   if you want to use token with expiration date
          //   expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy, ...handlers],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
