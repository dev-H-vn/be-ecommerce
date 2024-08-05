import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountsEntity])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
