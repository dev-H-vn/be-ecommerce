import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'guards/auth.guard';
import { Auth } from 'decorators';
import { RoleType } from 'constant';

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
