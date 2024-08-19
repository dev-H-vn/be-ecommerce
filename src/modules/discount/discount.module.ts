import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';

import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountsEntity])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
