import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopRegisterDto } from 'modules/auth/dto/register.dto';
import { ShopLoginDto } from 'modules/auth/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  //   @Post('/register')
  //   create(@Body() createShopDto: ShopRegisterDto) {
  //     return this.shopService.register(createShopDto);
  //   }

  //   @Post('/login')
  //   login(@Body() loginShopDto: ShopLoginDto) {
  //     return this.shopService.login(loginShopDto);
  //   }

  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
  //     return this.shopService.update(+id, updateShopDto);
  //   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id);
  }
}
