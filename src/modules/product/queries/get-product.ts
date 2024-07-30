import { NotFoundException } from '@nestjs/common';
import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ProductPageOptionsDto } from 'modules/user/dtos/users-page-options.dto';
import { Like, Repository } from 'typeorm';

export class GetProductQuery implements ICommand {
  constructor(
    public pageOptionsDto: ProductPageOptionsDto,
    public clientId: Uuid,
  ) {}
}

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private postRepository: Repository<ProductEntity>,
  ) {}

  async execute(params: GetProductQuery): Promise<PageDto<ProductEntity>> {
    const { clientId, pageOptionsDto } = params;
    const { order, page, skip, take, q } = pageOptionsDto;

    const [data, count] = await this.postRepository.findAndCount({
      //   where: q ? { productName: Like(`%${q}%`) } : {},
      order: {
        createdAt: order,
      },
      skip: skip,
      take,
    });
    console.log(
      '🐉 ~ GetProductHandler ~ execute ~ clientId ~ 🚀\n',
      count,
      data,
    );
    return { data: data, count: count };
  }
}
