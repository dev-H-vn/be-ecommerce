import { Module } from '@nestjs/common';
import { OrdersRepositoriesModule } from 'modules/order/repositories/order.repositories';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [OrdersRepositoriesModule.forRoot()],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
