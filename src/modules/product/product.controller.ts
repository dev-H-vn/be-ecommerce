import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'guards/auth.guard';
import { ProductPageOptionsDto } from 'modules/user/dtos/users-page-options.dto';
import { PageDto } from 'common/dto/page.dto';
import { ProductEntity } from 'modules/product/entities/product.entity';

@Controller('product')
@ApiBearerAuth()
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  create(
    @Req() request: RequestType,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(request, createProductDto);
  }

  @Post('/update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Req() request: RequestType,
    @Body() createProductDto: UpdateProductDto,
  ) {
    return this.productService.update(request, createProductDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAllProductOfTheShop(
    @Req() request: RequestType,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductEntity>> {
    return this.productService.findAllProductOfTheShop(request, pageOptionsDto);
  }

  @Patch('/publish/:id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  publishProductByShop(
    @Req() request: RequestType,
    @Param('id') id: Uuid,
  ): Promise<string | undefined> {
    return this.productService.publishProductByShop(request, id);
  }

  @Patch('/draft/:id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  draftProductByShop(
    @Req() request: RequestType,
    @Param('id') id: Uuid,
  ): Promise<string | undefined> {
    return this.productService.draftProductByShop(request, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
