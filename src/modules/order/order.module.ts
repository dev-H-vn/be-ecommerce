import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrdersRepositoriesModule } from 'modules/order/repositories/order.repositories';

@Module({
  imports: [OrdersRepositoriesModule.forRoot()],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
