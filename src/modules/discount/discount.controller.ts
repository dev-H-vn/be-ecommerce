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

@Controller('discount')
@ApiBearerAuth()
@ApiTags('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(AuthGuard)
  //   @HttpCode(HttpStatus.CREATED)
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
  ) {
    return this.discountService.findAllDiscountForProduct(id, pageOptionsDto);
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
