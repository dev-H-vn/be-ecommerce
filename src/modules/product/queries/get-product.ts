import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ProductRepositories } from 'modules/product/repositories/product.repositories';
import { ProductPageOptionsDto } from 'modules/user/dtos/users-page-options.dto';
import { ILike, Like, Repository } from 'typeorm';

export class GetProductQuery implements ICommand {
  constructor(
    public pageOptionsDto: ProductPageOptionsDto,
    public clientId: Uuid,
  ) {}
}

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @Inject('PRODUCT_REPOSITORIES')
    private repositories: ProductRepositories,
  ) {}

  async execute(params: GetProductQuery): Promise<PageDto<ProductEntity>> {
    const { clientId, pageOptionsDto } = params;
    console.log(
      '🐉 ~ GetProductHandler ~ execute ~ pageOptionsDto ~ 🚀\n',
      pageOptionsDto,
    );
    const { order, page, skip, take, q, isDrafted, isPublished } =
      pageOptionsDto;

    if (isDrafted && isPublished) {
      throw new BadRequestException(
        'request is failed, no product is isDraft and isPublished',
      );
    }

    const [data, count] =
      await this.repositories.productRepository.findAndCount({
        where: {
          productOwner: clientId,
          ...(q && { productName: ILike(`%${q}%`) }),
          ...(isPublished && { isDraft: false, isPublish: true }),
          ...(isDrafted && { isDraft: true, isPublish: false }),
        },
        order: {
          createdAt: order,
        },
        skip: skip,
        take,
      });
    console.log(
      '🐉 ~ GetProductHandler ~ execute ~ data-length ~ 🚀\n',
      data.length,
    );
    return { data: data, count: count };
  }
}
