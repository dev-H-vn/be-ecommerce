import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'constant';
import { Auth } from 'decorators';

import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
@ApiBearerAuth()
@ApiTags('cart')
export class CartController {
  constructor(private readonly cardService: CartService) {}

  @Post()
  @Auth([RoleType.USER])
  create(@Req() request: RequestType, @Body() createCartDto: CreateCartDto) {
    return this.cardService.create(request, createCartDto);
  }

  @Auth()
  @Get()
  findAll(@Req() request: RequestType) {
    return this.cardService.findAll(request);
  }

  @Delete(':id')
  remove(@Req() request: RequestType, @Body() productId: Uuid) {
    return this.cardService.removeProduct(request, productId);
  }
}
