import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'common/dto/page.dto';
import { RoleType } from 'constant';
import { Auth } from 'decorators';
import { AuthGuard } from 'guards/auth.guard';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';
import { DiscountPageOptionsDto } from 'modules/user/dtos/users-page-options.dto';

import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discount')
@ApiBearerAuth()
@ApiTags('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Auth([RoleType.ADMIN, RoleType.SHOP])
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/product/:id')
  findAllDiscountForProduct(
    @Param('id') id: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: DiscountPageOptionsDto,
  ): Promise<PageDto<DiscountsEntity>> {
    return this.discountService.findAllDiscountForProduct(id, pageOptionsDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/shop/:id')
  findAllDiscountForShop(
    @Param('id') id: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: DiscountPageOptionsDto,
  ): Promise<PageDto<DiscountsEntity>> {
    return this.discountService.findAllDiscountForShop(id, pageOptionsDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(Number(id), updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(Number(id));
  }
}
