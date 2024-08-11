import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'guards/auth.guard';
import {
  DiscountPageOptionsDto,
  ProductPageOptionsDto,
} from 'modules/user/dtos/users-page-options.dto';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';
import { PageDto } from 'common/dto/page.dto';
import { Auth } from 'decorators';
import { RoleType } from 'constant';

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
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
