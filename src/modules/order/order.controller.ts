import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'decorators';

import { CheckoutDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@ApiBearerAuth()
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() request: RequestType, @Body() checkoutDto: CheckoutDto) {
    return this.orderService.orderProducts(request, checkoutDto);
  }

  @Post('/order-preview')
  @Auth()
  getCheckoutPreview(
    @Req() request: RequestType,
    @Body() checkoutDto: CheckoutDto,
  ) {
    console.log('🐉 ~ OrderController ~ checkoutDto ~  🚀\n', checkoutDto);

    return this.orderService.getCheckoutPreview(request, checkoutDto);
  }

  @Post('/order-products')
  @Auth()
  orderProducts(@Req() request: RequestType, @Body() checkoutDto: CheckoutDto) {
    console.log('🐉 ~ OrderController ~ checkoutDto ~  🚀\n', checkoutDto);

    return this.orderService.getCheckoutPreview(request, checkoutDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(Number(id), updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(Number(id));
  }
}
