import { Module, forwardRef } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { AuthModule } from 'modules/auth/auth.module';
import { ShopEntity } from 'modules/shop/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([ShopEntity]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
